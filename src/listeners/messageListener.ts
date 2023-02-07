import { Message } from "discord.js";
import KaikiCache from "../cache/KaikiCache";
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
            await KaikiCache.populateERCache(message);
        }

        await Emotes.countEmotes(message);
    }
}
