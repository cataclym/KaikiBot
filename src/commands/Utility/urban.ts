import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import querystring from "querystring";
import { noArgGeneric } from "../../lib/Embeds";
import { trim } from "../../lib/Util";
import { KaikiCommand } from "Kaiki";

export default class UrbanDictCommand extends KaikiCommand {
	constructor() {
		super("urbandict", {
			aliases: ["urbandict", "urban", "ud"],
			description: "Searches Urban Dictionary for a word or sentence",
			usage: ["Watermelon", "anime"],
			args: [
				{
					id: "term",
					match: "rest",
					otherwise: (msg: Message) => noArgGeneric(msg),
				},
			],
		});
	}
	public async exec(message: Message, { term }: { term: string }): Promise<Message | void> {

		const query = querystring.stringify({ term: term });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());

		if (!list.length) {
			return message.channel.send({
				embeds: [new MessageEmbed({
					description: `No results found for **${term}**.`,
				})
					.withErrorColor(message)],
			});
		}
		const pages: MessageEmbed[] = [];
		for (const result of list) {
			pages.push(new MessageEmbed()
				.setTitle(result.word)
				.setURL(result.permalink)
				.addFields(
					{ name: "Definition", value: trim(result.definition, 1024) },
					{ name: "Example", value: trim(result.example, 1024) },
					{ name: "Rating", value: `${result.thumbs_up} thumbs up. ${result.thumbs_down} thumbs down.` },
				)
				.withOkColor(message),
			);
		}
		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
}
