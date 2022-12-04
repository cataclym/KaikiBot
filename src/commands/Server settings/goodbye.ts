import { EmbedBuilder, GuildTextBasedChannel, Message, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class GoodbyeConfigCommand extends KaikiCommand {
    constructor() {
        super("goodbye", {
            aliases: ["goodbyetoggle", "goodbye", "byetoggle", "bye"],
            userPermissions: PermissionsBitField.Flags.ManageGuild,
            channel: "guild",
            description: "Toggles leave messages. Bot defaults to current channel if no channel is provided.",
            usage: ["", "#leave-channel"],
            args: [
                {
                    id: "channel",
                    type: "textChannel",
                },
            ],
            subCategory: "Goodbye",
        });
    }

    public async exec(message: Message<true>, { channel }: { channel: GuildTextBasedChannel | null }): Promise<Message> {

        const embed = new EmbedBuilder()
            .withOkColor(message);

        let guildTable = await this.client.orm.guilds.findUnique({
            where: {
                Id: BigInt(message.guildId),
            },
            select: {
                ByeChannel: true,
            },
        });

        if (!guildTable) {
            guildTable = await this.client.db.getOrCreateGuild(message.guildId);
        }


        channel = channel || message.channel;

        const bigIntChannelId = BigInt(channel.id);

        switch (guildTable?.ByeChannel) {
            case undefined:
            case null: {
                await this.client.orm.guilds.update({
                    where: {
                        Id: BigInt(message.guildId),
                    },
                    data: {
                        ByeChannel: bigIntChannelId,
                    },
                });
                embed.setDescription(`Enabled goodbye message in ${channel.name}`);
                break;
            }
            case bigIntChannelId: {
                await this.client.orm.guilds.update({
                    where: {
                        Id: BigInt(message.guildId),
                    },
                    data: {
                        ByeChannel: null,
                    },
                });
                embed.setDescription("Disabled goodbye message");
                break;
            }
            default: {
                await this.client.orm.guilds.update({
                    where: {
                        Id: BigInt(message.guildId),
                    },
                    data: {
                        ByeChannel: bigIntChannelId,
                    },
                });
                embed.setDescription(`Set goodbye message to ${channel.name}`);
                break;
            }
        }

        return message.channel.send({
            embeds: [embed],
        });
    }
}
