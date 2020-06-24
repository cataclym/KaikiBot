const fetch = require("node-fetch");
const Discord = require("discord.js");
const { prefix } = require("../config.json");

module.exports = {
	name: "dadjoke",
	aliases: ["dadjokes",],
	description: "Returns a dadjoke.",
	args: false,
	usage: `${prefix}dadjoke`,
	execute(message) {
		const color = message.member.displayColor;
		loadTitle(message);
		message.channel.startTyping();
		function loadTitle() {
			fetch("https://www.reddit.com/r/dadjokes.json?limit=1000&?sort=top&t=all")
				.then(res => res.json())
				.then(json => json.data.children.map(t => t.data))
				.then(data => postRandomTitle(data));
		}
		function postRandomTitle(data) {
			const randomTitle = data[Math.floor(Math.random() * data.length) + 1];
			let RTSelftext = randomTitle.selftext.substring(0, 2045);
			if (randomTitle.selftext.length > 2048) {
				RTSelftext += "...";
			}
			const RTTitle = randomTitle.title.substring(0, 256);
			const embed = new Discord.MessageEmbed({
				"title": RTTitle,
				"description": RTSelftext,
				color,
				"author": {
					"name": `Submitted by ${randomTitle.author}`
				},
				"image": {
					"url": `${randomTitle.url}`,
				},
				"footer": {
					"text": `${randomTitle.ups} updoots`
				}
			});
			message.channel.stopTyping(true);
			message.channel.send(embed);
		}
	},
};