import { GuildTextBasedChannel, Message, MessageEmbed, Permissions } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class WelcomeToggleCommand extends KaikiCommand {
    constructor() {
        super("welcometoggle", {
            aliases: ["welcometoggle", "welcome"],
            userPermissions: Permissions.FLAGS.MANAGE_GUILD,
            channel: "guild",
            description: "Toggles welcome messages. Bot defaults to current channel if no channel is provided.",
            usage: ["", "#welcome-channel"],
            args: [{
                id: "channel",
                type: "textChannel",
            }],
            subCategory: "Welcome",
        });
    }

    public async exec(message: Message<true>, { channel }: { channel: GuildTextBasedChannel | null }): Promise<Message> {

        const embed = new MessageEmbed()
            .withOkColor(message);

        const guildTable = await this.client.db.getOrCreateGuild(BigInt(message.guildId));

        channel = channel || message.channel;

        const bigIntChannelId = BigInt(channel.id);

        switch (guildTable.WelcomeChannel) {
            case undefined:
            case null: {
                await this.client.orm.guilds.update({
                    where: {
                        Id: BigInt(message.guildId),
                    },
                    data: {
                        WelcomeChannel: bigIntChannelId,
                    },
                });
                embed.setDescription(`Enabled welcome message in ${channel.name}`);
                break;
            }
            case bigIntChannelId: {
                await this.client.orm.guilds.update({
                    where: {
                        Id: BigInt(message.guildId),
                    },
                    data: {
                        WelcomeChannel: null,
                    },
                });
                embed.setDescription("Disabled welcome message");
                break;
            }
            default: {
                await this.client.orm.guilds.update({
                    where: {
                        Id: BigInt(message.guildId),
                    },
                    data: {
                        WelcomeChannel: bigIntChannelId,
                    },
                });
                embed.setDescription(`Set welcome message to ${channel.name}`);
                break;
            }
        }

        return message.channel.send({
            embeds: [embed],
        });
    }
}
