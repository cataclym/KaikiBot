import fetch from "node-fetch";
import Discord from "discord.js";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

module.exports = class YeetCommand extends Command {
	constructor() {
		super("yeet", {
			cooldown: 8000,
			aliases: ["yeet"],
			typing: true,
			description: { description: "Returns yeet..." },
		});
	}

	async exec(message: Message) {
		const color = message.member?.displayColor;
		await loadTitle();
		async function loadTitle() {
			const promise = async () => fetch("https://www.reddit.com/r/YEET/.json?limit=1000&?sort=top&t=all");
			promise()
				.then((res) => res.json())
				.then((json) => json.data.children.map((t: any) => t.data))
				.then((data) => postRandomTitle(data));
		}
		async function postRandomTitle(data: any) {
			const randomRedditPost = data[Math.floor(Math.random() * data.length) + 1];
			let randomTitleSelfText = randomRedditPost.selftext.substring(0, 2045);
			if (randomRedditPost.selftext.length > 2048) {
				randomTitleSelfText += "...";
			}
			const RTTitle = randomRedditPost.title.substring(0, 256);
			const embed = new Discord.MessageEmbed({
				title: RTTitle,
				description: randomTitleSelfText,
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
};
