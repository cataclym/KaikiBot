import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import { Message } from "discord.js";
import KaikiCache from "../cache/KaikiCache";
import Emotes from "../lib/Emotes";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "messageCreate",
})
export default class MessageCreate extends KaikiListener {
    public async run(message: Message): Promise<void> {

        if (message.webhookId || message.author.bot || !message.inGuild()) return;

        if (!message.client.cache.emoteReactCache.has(message.guildId)) {
            await KaikiCache.populateERCache(message);
        }

        await Emotes.countEmotes(message);
    }
}
