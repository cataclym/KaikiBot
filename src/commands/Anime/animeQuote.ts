import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import logger from "loglevel";
import fetch from "node-fetch";
import { animeQuoteCache, respType } from "../../cache/cache";
import { sendQuote } from "../../lib/APIs";

export default class AnimeQuoteCommand extends Command {
	constructor() {
		super("animequote", {
			aliases: ["animequote", "aq"],
			description: { description: "Shows a random anime quote...", usage: "" },
			typing: true,
		});
	}
	public async exec(message: Message): Promise<Message | void> {

		const resp: respType = await fetch("https://animechan.vercel.app/api/random")
			.then(response => response.json())
			.catch((reason) => {
				logger.warn(`Animequote received no data: ${reason}\n`);

				if (Object.entries(animeQuoteCache).length) {
					return sendQuote(animeQuoteCache[Math.floor(Math.random() * Object.keys(animeQuoteCache).length)], message);
				}

				return;
			});

		if (!animeQuoteCache[resp.character]) animeQuoteCache[resp.character] = resp;

		return sendQuote(resp, message);
	}
}