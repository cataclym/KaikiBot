import { Collection, EmbedBuilder, GuildBasedChannel, Message, PermissionsBitField } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class DeleteChannelCommand extends KaikiCommand {
    constructor() {
        super("deletechannel", {
            aliases: ["deletechannel", "dtchnl", "delchan"],
            description: "Deletes one or more channels. Also deletes categories, threads and voice channels.",
            usage: "#channel1 #channel2 #channel3",
            channel: "guild",
            userPermissions: PermissionsBitField.Flags.ManageChannels,
            clientPermissions: PermissionsBitField.Flags.ManageChannels,
            args: [
                {
                    id: "channels",
                    type: "channels",
                    match: "separate",
                    otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
                },
            ],
        });
    }

    public async exec(m: Message, { channels }: { channels: Collection<string, GuildBasedChannel>[] }): Promise<Message | void> {

        const deletedChannels: string[] = [];

        await Promise.all(channels.reduce((acc, val) => [...acc, ...val], [])
            .map(async chan => {
                const c = await chan[1].delete();
                deletedChannels.push(`#${c.name} [${c.id}]`);
            }));

        return m.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Channel(s) deleted")
                    .addFields([
                        {
                            name: "Deleted:",
                            value: deletedChannels
                                .join("\n"),
                        },
                    ])
                    .withOkColor(m),
            ],
        });
    }
}
