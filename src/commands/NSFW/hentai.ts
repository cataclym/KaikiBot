import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class HentaiCommand extends Command {
    constructor() {
        super("hentai", {
            aliases: ["hentai"],
        });
    }
    public async exec(message: Message) {
        const condition = async (message: Message) => {
            let condition: boolean = false;
                if (message.channel.type === "text") {
                    if (message.channel.nsfw) {
                        condition = true;
                    }
                }
                return condition
        }
        if (condition(message)) {
        return message.util?.send("yes it worked"); 
        }
    }
}