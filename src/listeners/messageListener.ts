import { Message } from "discord.js";
import Emotes from "../lib/Emotes";
import KaikiListener from "../lib/Kaiki/KaikiListener";

export default class MessageListener extends KaikiListener {
    constructor() {
        super("message", {
            event: "messageCreate",
            emitter: "client",
        });
    }

    public async exec(message: Message): Promise<void> {

        if (message.webhookId || message.author.bot || !message.inGuild()) return;

        if (!message.client.cache.emoteReactCache.has(message.guildId)) {
            await this.client.cache.populateERCache(message);
        }
        await Emotes.countEmotes(message);
    }
}
