import fetch from "node-fetch";
import Discord from "discord.js";
import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { trim } from "../../util/Util";
import { ChildrenEntity, Data1 } from "../../struct/redditModel";

export default class YeetCommand extends Command {
	constructor() {
		super("yeet", {
			cooldown: 8000,
			aliases: ["yeet"],
			typing: true,
			description: { description: "Returns yeet..." },
		});
	}

	public async exec(message: Message): Promise<Message | void> {

		const color = message.member?.displayColor;

		await loadTitle();
		async function loadTitle() {
			const promise = async () => fetch("https://www.reddit.com/r/YEET/.json?limit=1000&?sort=top&t=all");
			promise()
				.then((res) => res.json())
				.then((json) => json.data.children.map((t: ChildrenEntity) => t.data))
				.then((data) => postRandomTitle(data));
		}

		async function postRandomTitle(data: Data1[]) {

			const randomRedditPost = data[Math.floor(Math.random() * data.length) + 1];

			const embed = new Discord.MessageEmbed({
				title: trim(randomRedditPost.title, 256),
				description: trim(randomRedditPost.selftext, 2048),
				color,
				author: {
					name: `Submitted by ${randomRedditPost.author}`,
					url: randomRedditPost.url,
				},
				image: {
					url: `${randomRedditPost.url}`,
				},
				footer: {
					text: `${randomRedditPost.ups} updoots`,
				},
			});

			return message.util?.send(embed);
		}
	}
}
