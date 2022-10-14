import { Command, Inhibitor } from "discord-akairo";
import { EmbedBuilder } from "discord.js";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";
export default class NSFWInhibitor extends Inhibitor {
    constructor() {
        super("nsfwinhibitor", {
            reason: "Not ran in a NSFW channel.",
        });
    }

    async exec(message: Message, command: Command): Promise<boolean> {

        if (message.guild) {
            if (command.categoryID === "NSFW" && !(message.channel as TextChannel).nsfw) {
                message.channel.send({
                    embeds: [new EmbedBuilder({
                        title: "Error",
                        description: "Channel is not NSFW.",
                    })
                        .withErrorColor(message)],
                });
                return true;
            }
        }
        return false;
    }
}
