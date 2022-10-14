import { Channel, Collection, GuildChannel, Message, EmbedBuilder, Permissions, ThreadChannel } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

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
                otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
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
            embeds: [new EmbedBuilder()
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
