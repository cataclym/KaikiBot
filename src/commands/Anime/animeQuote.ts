import { Message } from "discord.js";
import logger from "loglevel";
import fetch from "node-fetch";
import type { respType } from "Types/TCustom";
import { sendQuote } from "../../lib/APIs/animeQuote";
import KaikiCommand from "Kaiki/KaikiCommand";

export default class AnimeQuoteCommand extends KaikiCommand {
    constructor() {
        super("animequote", {
            aliases: ["animequote", "aq"],
            description: "Shows a random anime quote...",
            usage: "",
            typing: true,
        });
    }
    public async exec(message: Message): Promise<Message | void> {

        const { animeQuoteCache } = this.client.cache;

        const resp = <respType> await fetch("https://animechan.vercel.app/api/random")
            .then(response => response.json())
            .catch((reason) => {
                logger.warn(`Animequote received no data: ${reason}\n`);
                if (Object.entries(animeQuoteCache).length) {
                    return sendQuote(animeQuoteCache.random(), message);
                }
            });

        if (!animeQuoteCache.has(resp.character)) animeQuoteCache.set(resp.character, resp);

        return sendQuote(resp, message);
    }
}
