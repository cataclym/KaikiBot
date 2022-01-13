import { Listener } from "discord-akairo";
import { Message } from "discord.js";
import { countEmotes } from "../lib/functions";

export default class MessageListener extends Listener {
    constructor() {
        super("message", {
            event: "messageCreate",
            emitter: "client",
        });
    }

    public async exec(message: Message): Promise<void> {

        if (message.webhookId || message.author.bot || !message.guild) return;

        await countEmotes(message);

    }
}
