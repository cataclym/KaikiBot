import { Channel, Collection, GuildChannel, Message, MessageEmbed, Permissions, ThreadChannel } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { KaikiCommand } from "kaiki";

export default class DeleteChannelCommand extends KaikiCommand {
    constructor() {
        super("deletechannel", {
            aliases: ["deletechannel", "dtchnl", "delchan"],
            description: "Deletes one or more channels. Also deletes categories and voice channels.",
            usage: "#channel1 #channel2 #channel3",
            channel: "guild",
            userPermissions: Permissions.FLAGS.MANAGE_CHANNELS,
            clientPermissions: Permissions.FLAGS.MANAGE_CHANNELS,
            args: [{
                id: "channels",
                type: "channels",
                match: "separate",
                otherwise: (m: Message) => ({ embeds: [noArgGeneric(m)] }),
            }],
        });
    }

    public async exec(m: Message, { channels }: { channels: Collection<string, Channel>[] }): Promise<Message | void> {

        async function deleteChannels() {
            return await Promise.all(channels
                .map((chan) => chan
                    .map(async c => c.delete())));
        }

        const deletedChannels = await Promise.all(([] as Promise<Channel>[]).concat(...await deleteChannels()));

        return m.channel.send({
            embeds: [new MessageEmbed()
                .setTitle("Channel(s) deleted")
                .addField("Deleted:", (await Promise.all(deletedChannels
                    .map(async (c) => {
                        if (c instanceof GuildChannel || c instanceof ThreadChannel) {
                            return `${c.name} [${c.id}]`;
                        }
                        return `[${c.id}]`;
                    }))).join("\n"))
                .withOkColor(m)],
        });
    }
}
