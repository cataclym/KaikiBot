import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Message } from "discord.js";
import KaikiCache from "../cache/KaikiCache";
import { DadBot } from "../lib/DadBot";
import Emotes from "../lib/Emotes/Emotes";

@ApplyOptions<ListenerOptions>({
    event: "messageCreate",
})
export default class MessageCreate extends Listener {
    public async run(message: Message): Promise<void> {

        if (message.webhookId || message.author.bot || !message.inGuild()) return;

        if (!message.client.cache.emoteReactCache.has(message.guildId)) {
            await KaikiCache.populateERCache(message);
        }

        await Promise.all([DadBot.run(message), Emotes.countEmotes(message)]);
    }
}
