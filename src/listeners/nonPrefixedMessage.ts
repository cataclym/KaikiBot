import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCache from "../lib/Cache/KaikiCache";
import { DadBot } from "../lib/DadBot";
import Emotes from "../lib/Emotes/Emotes";
import KaikiUtil from "../lib/KaikiUtil";

@ApplyOptions<ListenerOptions>({
    event: Events.NonPrefixedMessage,
})
export default class NonPrefixedMessage extends Listener {
    public async run(message: Message) {
        if (!message.inGuild()) return;
         
        let promise;

        if (!message.client.cache.emoteReactCache.has(message.guildId)) {
            promise = KaikiCache.populateERCache(message);
        }

        await Promise.all([
            promise,
            DadBot.run(message),
            Emotes.countEmotes(message),
            message.client.cache.emoteReact(message),
        ]);
    }
}
