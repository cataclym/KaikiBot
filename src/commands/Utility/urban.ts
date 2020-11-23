import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import fetch from "node-fetch";
import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";
import querystring from "querystring";
import { errorColor, getMemberColorAsync, trim } from "../../util/Util";
import { noArgGeneric } from "../../util/embeds";

export default class UrbanDictCommand extends Command {
	constructor() {
		super("urbandict", {
			aliases: ["urbandict", "urban", "ud"],
			description: { description: "Searches Urban Dictionary for a word or sentence", usage: "Watermelon" },
			args: [
				{
					id: "term",
					match: "rest",
					otherwise: (msg: Message) => noArgGeneric(msg.util?.parsed?.command),
				},
			],
		});
	}
	public async exec(message: Message, { term }: { term: string }): Promise<Message | void> {

		const query = querystring.stringify({ term: term });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());

		if (!list.length) {
			return message.channel.send(new MessageEmbed({
				description: `No results found for **${term}**.`,
				color: errorColor,
			}));
		}
		const color = await getMemberColorAsync(message);
		const pages: MessageEmbed[] = [];
		list.forEach(async (result: Record<string, string>) => {
			return pages.push(new MessageEmbed()
				.setTitle(result.word)
				.setURL(result.permalink)
				.addFields(
					{ name: "Definition", value: trim(result.definition, 1024) },
					{ name: "Example", value: trim(result.example, 1024) },
					{ name: "Rating", value: `${result.thumbs_up} thumbs up. ${result.thumbs_down} thumbs down.` },
				)
				.setColor(color),
			);
		});
		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
}