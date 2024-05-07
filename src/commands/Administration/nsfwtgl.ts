import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "nsfwtgl",
    aliases: ["nsfw", "nsfwtoggle"],
    usage: "",
    description: "Toggles NSFW in current channel",

    requiredUserPermissions: ["ManageChannels"],
    requiredClientPermissions: ["ManageChannels"],
    preconditions: ["GuildOnly"],
})
export default class ChannelNsfwCommand extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message> {
        const channel = message.channel as TextChannel;

        const result = `NSFW in ${channel} has been ${!channel.nsfw ? "enabled" : "disabled"}.`;
        await channel.setNSFW(
            !channel.nsfw,
            `${message.author.username} toggled NSFW.`
        );

        return message.channel.send({
            embeds: [
                new EmbedBuilder({
                    description: result,
                }).withOkColor(message),
            ],
        });
    }
}
