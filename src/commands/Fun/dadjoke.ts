import { getMemberColorAsync, trim } from "../../functions/Util";
import fetch from "node-fetch";
import { MessageEmbed, Message } from "discord.js";
import { Command } from "discord-akairo";

export default class DadJokeCommand extends Command {
	constructor() {
		super("dadjoke", {
			cooldown: 8000,
			typing: true,
			aliases: ["dadjoke", "dadjokes"],
			description: { description: "Returns a dadjoke." },
		});
	}

	async exec(message: Message): Promise<Message | void> {

		await loadTitle();
		async function loadTitle() {
			const promise = async () => fetch("https://www.reddit.com/r/dadjokes.json?limit=1000&?sort=top&t=all");
			promise()
				.then((res) => res.json())
				.then((json) => json.data.children.map((t: any) => t.data))
				.then((data) => postRandomTitle(data));
		}

		async function postRandomTitle(data: any) {
			const randomRedditPost = data[Math.floor(Math.random() * data.length) + 1];
			const randomTitleSelfText = trim(randomRedditPost.selftext, 2048);
			const RTTitle = trim(randomRedditPost.title, 256);

			const embed: MessageEmbed = new MessageEmbed({
				title: RTTitle,
				description: randomTitleSelfText,
				color: await getMemberColorAsync(message),
				author: {
					name: `Submitted by ${randomRedditPost.author}`,
				},
				image: {
					url: randomRedditPost.url,
				},
				footer: {
					text: `${randomRedditPost.ups} updoots`,
				},
			});

			return message?.util?.send(embed);
		}
	}
}
