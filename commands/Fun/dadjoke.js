/* eslint-disable linebreak-style */
const fetch = require("node-fetch");
const Discord = require("discord.js");
const { Command } = require("discord-akairo");

module.exports = class DadJokeCommand extends Command {
	constructor() {
		super("dadjoke", {
			name: "dadjoke",
			cooldown: 8000,
			aliases: ["dadjoke", "dadjokes"],
			description: { description: "Returns a dadjoke." },
		});
	}

	exec(message) {
		const color = message.member.displayColor;
		loadTitle(message);
		message.channel.startTyping();
		function loadTitle() {
			fetch("https://www.reddit.com/r/dadjokes.json?limit=1000&?sort=top&t=all")
				.then((res) => res.json())
				.then((json) => json.data.children.map((t) => t.data))
				.then((data) => postRandomTitle(data));
		}
		function postRandomTitle(data) {
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
					url: `${randomTitle.url}`,
				},
				footer: {
					text: `${randomTitle.ups} updoots`,
				},
			});
			message.channel.stopTyping(true);
			return message.util.send(embed);
		}
	}
};
