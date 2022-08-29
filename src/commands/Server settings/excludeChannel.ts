import { DadBotChannels, Guilds } from "@prisma/client";
import { Collection, GuildChannel, Message, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class ExcludeDadbotChannelCommand extends KaikiCommand {
    constructor() {
        super("excludechannel", {
            aliases: ["excludechannel", "excludechnl", "echnl"],
            userPermissions: "MANAGE_CHANNELS",
            channel: "guild",
            description: "Exclude or include a channel from dadbot. Provide no parameter to show a list of excluded channels. ",
            usage: ["", "#channel"],
            args: [
                {
                    id: "channels",
                    type: "textChannels",
                },
            ],
        });
    }

    public async exec(message: Message<true>, { channels }: { channels: Collection<Snowflake, TextChannel> | undefined }): Promise<Message> {

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
            guildDb = await this.client.db.getOrCreateGuild(bigIntGuildId) as (Guilds & { DadBotChannels: DadBotChannels[] });
            guildDb["DadBotChannels"] = [];
        }

        const embed = new MessageEmbed()
            .setTitle("Excluded channels")
            .withOkColor(message);

        if (!channels) {
            return message.channel.send({
                embeds: [embed
                    .setDescription((guildDb?.DadBotChannels ?? [])
                        .map(k => message.guild.channels.cache.get(String(k.ChannelId)) ?? String(k.ChannelId))
                        .sort((a, b) => {
                            return (a as GuildChannel).name < (b as GuildChannel).name
                                ? -1
                                : 1;
                        })
                        .join("\n").trim() ?? "No channels excluded")
                    .withOkColor(message)],
            });
        }

        const GuildId = BigInt(message.guildId), enabledChannels: bigint[] = [],
            excludedChannels: { GuildId: bigint, ChannelId: bigint }[] = [];

        for (const [id] of channels) {

            if (guildDb.DadBotChannels.find(c => String(c.ChannelId) === id)) {
                enabledChannels.push(BigInt(id));
            }

            else {
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

            embed.addField("Excluded", excludedChannels
                .map(k => message.guild.channels.cache.get(String(k.ChannelId)) ?? String(k.ChannelId))
                .join("\n"));
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

            embed.addField("Un-excluded", enabledChannels
                .map(k => message.guild.channels.cache.get(String(k)) ?? String(k))
                .join("\n"));
        }

        return message.channel.send({
            embeds: [embed],
        });
    }
}
