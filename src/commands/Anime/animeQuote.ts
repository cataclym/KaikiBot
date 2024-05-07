import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import { sendQuote } from "../../lib/APIs/animeQuote";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import { AnimeQuoteResponse } from "../../lib/Types/Miscellaneous";
import { UserError } from "@sapphire/framework";

@ApplyOptions<KaikiCommandOptions>({
    name: "animequote",
    aliases: ["aq"],
    usage: "",
    description: "Shows a random anime quote...",
    typing: true,
})
export default class AnimeQuoteCommand extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message | void> {
        const { animeQuoteCache } = this.client.cache;

        let resp = await fetch("https://animechan.xyz/api/random").catch(
            (err) => this.getCachedResponse(err)
        );

        if (!resp?.ok) {
            resp = this.getCachedResponse(resp);
        }
        const quoteData = <AnimeQuoteResponse>await resp.json();

        if (!animeQuoteCache.has(quoteData.character))
            animeQuoteCache.set(quoteData.character, quoteData);

        return sendQuote(quoteData, message);
    }

    private getCachedResponse(err: Response) {
        const { animeQuoteCache } = this.client.cache;

        this.container.logger.warn(`Animequote received no data: ${err}`);

        if (animeQuoteCache.size)
            return new Response(JSON.stringify(animeQuoteCache.random()));

        throw new UserError({
            message: "No quotes received, try again at another time.",
            identifier: "NoAnimeQuotes",
        });
    }
}
