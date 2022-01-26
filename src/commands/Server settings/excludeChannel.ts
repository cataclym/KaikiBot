import { Guild, GuildChannel, Message, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import { KaikiCommand } from "kaiki";
import { Argument } from "discord-akairo";

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
                    type: Argument.union("textChannels"),
                },
            ],
        });
    }

    public async exec(message: Message, { channels }: { channels: Map<Snowflake, TextChannel> | undefined }): Promise<Message> {

        const gId = (message.guild as Guild).id;
        const bigIntGuildId = BigInt(gId);
        const guildDb = await this.client.orm.guilds.findUnique({
            where: {
                Id: bigIntGuildId,
            },
            select: {
                DadBotChannels: true,
            },
        });

        const embed = new MessageEmbed()
            .setTitle("Excluded channels")
            .withOkColor(message);

        if (!channels) {
            return message.channel.send({
                embeds: [embed
                    .setDescription((guildDb!.DadBotChannels ?? [])
                        .map(k => message.guild!.channels.cache.get(String(k.ChannelId)) ?? String(k.ChannelId))
                        .sort((a, b) => {
                            return (a as GuildChannel).name < (b as GuildChannel).name
                                ? -1
                                : 1;
                        })
                        .join("\n").trim() ?? "No channels excluded")
                    .withOkColor(message)],
            });
        }

        const enabledChannels: bigint[] = [];
        const excludedChannels: {ChannelId: bigint}[] = [];

        for (const [, channel] of channels) {

            if (guildDb!.DadBotChannels.find(c => String(c.ChannelId) === channel.id)) {
                enabledChannels.push(BigInt(channel.id));
            }

            else {
                excludedChannels.push({
                    ChannelId: BigInt(channel.id),
                });
            }
        }

        if (excludedChannels.length) {
            await this.client.orm.guilds.update({
                where: {
                    Id: bigIntGuildId,
                },
                data: {
                    DadBotChannels: {
                        createMany: {
                            data: excludedChannels,
                            skipDuplicates: true,
                        },
                    },
                },
            });
            embed.addField("Excluded", excludedChannels
                .map(k => message.guild!.channels.cache.get(String(k.ChannelId)) ?? String(k.ChannelId))
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
            embed.addField("Unexcluded", enabledChannels
                .map(k => message.guild!.channels.cache.get(String(k)) ?? String(k))
                .join("\n"));
        }

        void this.client.dadBotChannelsProvider.init();

        return message.channel.send({
            embeds: [embed],
        });
    }
}
