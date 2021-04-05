import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { PurpleData, RedditData } from "../../interfaces/IRedditAPI";
import { trim } from "../../nsb/Util";

export default class DadJokeCommand extends Command {
	constructor() {
		super("dadjoke", {
			cooldown: 8000,
			typing: true,
			aliases: ["dadjoke", "dadjokes"],
			description: { description: "Returns a dadjoke." },
		});
	}

	public async exec(message: Message): Promise<Message | void> {

		await (async function loadTitle() {
			const promise = async () => fetch("https://www.reddit.com/r/dadjokes.json?limit=1000&?sort=top&t=all");
			await promise()
				.then(res => res.json())
				.then((json: RedditData) => json.data.children.map(t => t.data))
				.then((data) => postRandomTitle(data));
		})();

		async function postRandomTitle(data: PurpleData[]) {

			const randomRedditPost = data[Math.floor(Math.random() * data.length) + 1];

			return message?.util?.send(new MessageEmbed({
				title: randomRedditPost.title ? trim(randomRedditPost.title, 256) : "\u200B",
				description: randomRedditPost.selftext ? trim(randomRedditPost.selftext, 2048) : "\u200B",
				author: {
					name: `Submitted by ${randomRedditPost.author}`,
					url: randomRedditPost.url,
				},
				image: {
					url: randomRedditPost.url,
				},
				footer: {
					text: `${randomRedditPost.ups} updoots`,
				},
			})
				.withOkColor(message));
		}
	}
}
