import { Command } from "@cataclym/discord-akairo";
import Discord, { Message } from "discord.js";
import fetch from "node-fetch";
import { PurpleData, RedditData } from "../../interfaces/IRedditAPI";
import { trim } from "../../lib/Util";

export default class YeetCommand extends Command {
	constructor() {
		super("reddityeet", {
			aliases: ["reddityeet", "ryeet", "ry"],
			typing: true,
			description: { description: "Returns yeet..." },
		});
	}

	public async exec(message: Message): Promise<Message | void> {

		await (async function loadTitle() {
			const promise = async () => fetch("https://www.reddit.com/r/YEET/.json?limit=1000&?sort=top&t=all");
			await promise()
				.then(res => res.json())
				.then((json: RedditData) => json.data.children.map(t => t.data))
				.then((data) => postRandomTitle(data));
		})();

		async function postRandomTitle(data: PurpleData[]) {

			const randomRedditPost = data[Math.floor(Math.random() * data.length) + 1];

			const embed = new Discord.MessageEmbed({
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
				.withOkColor();

			return message.util?.send(embed);
		}
	}
}
