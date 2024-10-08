import { DadBotChannels, Guilds } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "excludechannel",
    aliases: ["excludechnl", "echnl"],
    description:
		"Exclude or include, one or more, channels from dadbot. Provide no parameter to show a list of excluded channels. ",
    usage: ["", "#channel"],
    requiredUserPermissions: ["ManageChannels"],
    preconditions: ["GuildOnly"],
})
export default class ExcludeDadbotChannelCommand extends KaikiCommand {
    public async messageRun(
        message: Message<true>,
        args: Args
    ): Promise<Message> {
        const channels = await args
            .repeat("guildChannel")
            .catch(() => undefined);

        const bigIntGuildId = BigInt(message.guildId);
        let guildDb = await this.client.orm.guilds.findUnique({
            where: {
                Id: bigIntGuildId,
            },
            select: {
                DadBotChannels: true,
            },
        });

        if (!guildDb) {
            guildDb = (await this.client.db.getOrCreateGuild(
                bigIntGuildId
            )) as Guilds & {
				DadBotChannels: DadBotChannels[];
			};
            guildDb["DadBotChannels"] = [];
        }

        const embed = new EmbedBuilder()
            .setTitle("Excluded channels")
            .withOkColor(message);

        if (!channels) {
            return message.reply({
                embeds: [
                    embed
                        .setDescription(
                            guildDb.DadBotChannels.length
                                ? guildDb.DadBotChannels.map((k) => {
                                    const channel =
											message.guild.channels.cache.get(
											    String(k.ChannelId)
											);

                                    return channel
                                        ? `${channel.name} [${channel.id}]`
                                        : String(k.ChannelId);
                                })
                                    .sort((a, b) => (a < b ? -1 : 1))
                                    .join("\n")
                                    .trim()
                                : "No channels excluded"
                        )
                        .withOkColor(message),
                ],
            });
        }

        const GuildId = BigInt(message.guildId),
            enabledChannels: bigint[] = [],
            excludedChannels: { GuildId: bigint; ChannelId: bigint }[] = [];

        for (const { id } of channels) {
            if (
                guildDb.DadBotChannels.find((c) => String(c.ChannelId) === id)
            ) {
                enabledChannels.push(BigInt(id));
            } else {
                excludedChannels.push({
                    GuildId,
                    ChannelId: BigInt(id),
                });
            }
        }

        if (excludedChannels.length) {
            await this.client.orm.dadBotChannels.createMany({
                data: excludedChannels,
                skipDuplicates: true,
            });

            for (const obj of excludedChannels) {
                this.client.dadBotChannels.items.set(String(obj.ChannelId), {
                    ChannelId: String(obj.ChannelId),
                    GuildId: String(obj.GuildId),
                });
            }

            embed.addFields([
                {
                    name: "Excluded",
                    value: excludedChannels
                        .map((k) => {
                            const channel = message.guild.channels.cache.get(
                                String(k.ChannelId)
                            );

                            return channel
                                ? `${channel.name} [${channel.id}]`
                                : String(k.ChannelId);
                        })
                        .join("\n"),
                },
            ]);
        }

        if (enabledChannels.length) {
            await this.client.orm.dadBotChannels.deleteMany({
                where: {
                    ChannelId: {
                        in: enabledChannels,
                    },
                    GuildId: bigIntGuildId,
                },
            });

            for (const channel of enabledChannels) {
                this.client.dadBotChannels.items.delete(String(channel));
            }

            embed.addFields([
                {
                    name: "Un-excluded",
                    value: enabledChannels
                        .map((k) => {
                            const channel = message.guild.channels.cache.get(
                                String(k)
                            );

                            return channel
                                ? `${channel.name} [${channel.id}]`
                                : String(k);
                        })
                        .join("\n"),
                },
            ]);
        }

        return message.reply({
            embeds: [embed],
        });
    }
}
