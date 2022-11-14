import { EmbedBuilder, Message, PermissionsBitField, TextChannel } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class ChannelNsfwCommand extends KaikiCommand {
    constructor() {
        super("nsfwtgl", {
            aliases: ["nsfwtgl", "nsfw", "nsfwtoggle"],
            clientPermissions: PermissionsBitField.Flags.ManageChannels,
            userPermissions: PermissionsBitField.Flags.ManageChannels,
            description: "Toggles NSFW in current channel",
            usage: "",
            channel: "guild",
        });
    }

    public async exec(message: Message): Promise<Message> {

        const channel = message.channel as TextChannel;

        const result = `NSFW in ${channel} has been ${!channel.nsfw ? "enabled" : "disabled"}.`;
        await channel.setNSFW(!channel.nsfw, `${message.author.tag} toggled NSFW.`);

        return message.channel.send({
            embeds: [
                new EmbedBuilder({
                    description: result,
                })
                    .withOkColor(message),
            ],
        });
    }
}
