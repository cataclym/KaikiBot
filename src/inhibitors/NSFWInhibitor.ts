import { Command, Inhibitor } from "discord-akairo";
import { ChannelType, EmbedBuilder, Message, TextChannel } from "discord.js";

export default class NSFWInhibitor extends Inhibitor {
    constructor() {
        super("nsfwinhibitor", {
            reason: "Not ran in a NSFW channel.",
        });
    }

    async exec(message: Message<true>, command: Command): Promise<boolean> {

        if (message.channel.type === ChannelType.GuildText) {
            if ((command.categoryID === "NSFW" || command.onlyNsfw) && !(message.channel as TextChannel).nsfw) {
                message.channel.send({
                    embeds: [
                        new EmbedBuilder({
                            title: "Error",
                            description: "Channel is not NSFW.",
                        })
                            .withErrorColor(message),
                    ],
                });
                return true;
            }
        }
        return false;
    }
}
