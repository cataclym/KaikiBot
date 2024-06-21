import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "deletechannel",
    aliases: ["dtchnl", "delchan"],
    description:
		"Deletes one or more channels. Also deletes categories, threads and voice channels.",
    usage: "#channel1 #channel2 #channel3",
    requiredUserPermissions: ["ManageChannels"],
    requiredClientPermissions: ["ManageChannels"],
    preconditions: ["GuildOnly"],
})
export default class DeleteChannelCommand extends KaikiCommand {
    public async messageRun(m: Message<true>, args: Args) {
        const channels = await args.repeat("guildChannel");

        const deletedChannels: string[] = [];

        await Promise.all(
            channels
                .reduce((acc, val) => [...acc, val], [])
                .map(async (chan) => {
                    const c = await chan.delete();
                    deletedChannels.push(`#${c.name} [${c.id}]`);
                })
        );

        // Don't send message if current channel was deleted
        if (channels.includes(m.channel)) return;

        return m.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Channel(s) deleted")
                    .addFields([
                        {
                            name: "Deleted:",
                            value: deletedChannels.join("\n"),
                        },
                    ])
                    .withOkColor(m),
            ],
        });
    }
}
