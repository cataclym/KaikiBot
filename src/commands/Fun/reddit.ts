import fetch from "node-fetch";
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util";

module.exports = class RedditCommand extends Command {
	constructor() {
		super("reddit", {
			cooldown: 8000,
			aliases: ["reddit"],
			typing: true,
			description: { description: "Returns a random reddit post, from a specified subreddit.", usage: "" },
			args: [
				{
					id: "sub",
					match: "rest",
				},
			],
		});
	}

	async exec(message: Message, { sub }: { sub: string }) {

		await loadTitle();
		async function loadTitle() {
			const promise = async () => fetch(`https://www.reddit.com/r/${sub}/random/.json?limit=1000&?sort=top&t=all`);
			promise()
				.then((res) => res.json())
				.then((json) => json.data.children.map((t: any) => {
					console.log(t);
					console.log(typeof (t));
					return t.data;
				})
					.then((data: any) => postRandomTitle(data)));
		}
		async function postRandomTitle(data: any) {

			console.log(data);
			console.log(typeof (data));

			let randomTitleSelfText = data.selftext.substring(0, 2045);
			if (data.selftext.length > 2048) {
				randomTitleSelfText += "...";
			}
			const RTTitle = data.title.substring(0, 256);
			const embed = new Discord.MessageEmbed({
				title: RTTitle,
				description: randomTitleSelfText,
				color: await getMemberColorAsync(message),
				author: {
					name: `Submitted by ${data.author}`,
					url: data.url,
				},
				image: { url: `${data.url}` },
				footer: { text: `${data.ups} updoots` },
			});
			return message.util?.send(embed);
		}
	}
};
