const fetch = require("node-fetch");
const Discord = require("discord.js");
const { Command } = require("discord-akairo");

module.exports = class DadJokeCommand extends Command {
	constructor() {
		super("dadjoke", {
			name: "dadjoke",
			cooldown: 8000,
			typing: true,
			aliases: ["dadjoke", "dadjokes"],
			description: { description: "Returns a dadjoke." },
		});
	}

	async exec(message) {
		const color = message.member.displayColor;
		await loadTitle(message);
		async function loadTitle() {
			const promise = async () => fetch("https://www.reddit.com/r/dadjokes.json?limit=1000&?sort=top&t=all");
			promise()
				.then((res) => res.json())
				.then((json) => json.data.children.map((t) => t.data))
				.then((data) => postRandomTitle(data));
		}
		async function postRandomTitle(data) {
			const randomTitle = data[Math.floor(Math.random() * data.length) + 1];
			let randomTitleSelfText = randomTitle.selftext.substring(0, 2045);
			if (randomTitle.selftext.length > 2048) {
				randomTitleSelfText += "...";
			}
			const RTTitle = randomTitle.title.substring(0, 256);
			const embed = new Discord.MessageEmbed({
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
			return message.util.send(embed);
		}
	}
};
