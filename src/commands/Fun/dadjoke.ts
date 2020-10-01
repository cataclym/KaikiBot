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

	async exec(message: Message) {
		const color: number = message!.member!.displayColor;
		await loadTitle();
		async function loadTitle() {
			const promise = async () => fetch("https://www.reddit.com/r/dadjokes.json?limit=1000&?sort=top&t=all");
			promise()
				.then((res) => res.json())
				.then((json) => json.data.children.map((t: any) => t.data))
				.then((data) => postRandomTitle(data));
		}
		async function postRandomTitle(data: any) {
			const randomTitle = data[Math.floor(Math.random() * data.length) + 1];
			let randomTitleSelfText = randomTitle.selftext.substring(0, 2045);
			if (randomTitle.selftext.length > 2048) {
				randomTitleSelfText += "...";
			}
			const RTTitle = randomTitle.title.substring(0, 256);
			const embed: MessageEmbed = new MessageEmbed({
				title: RTTitle,
				description: randomTitleSelfText,
				color,
				author: {
					name: `Submitted by ${randomTitle.author}`,
				},
				image: {
					url: randomTitle.url,
				},
				footer: {
					text: `${randomTitle.ups} updoots`,
				},
			});
			return message!.util!.send(embed);
		}
	}
};
