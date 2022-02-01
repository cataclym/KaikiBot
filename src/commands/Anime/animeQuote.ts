import { Message } from "discord.js";
import logger from "loglevel";
import fetch from "node-fetch";
import { respType } from "../../cache/cache";
import { sendQuote } from "../../lib/APIs/animeQuote";
import { KaikiCommand } from "kaiki";

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
                    return sendQuote(animeQuoteCache[Math.floor(Math.random() * Object.keys(animeQuoteCache).length)], message);
                }
            });

        if (!animeQuoteCache[resp.character]) animeQuoteCache[resp.character] = resp;

        return sendQuote(resp, message);
    }
}
