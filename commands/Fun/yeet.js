const fetch = require("node-fetch");
const Discord = require("discord.js");
const { Command } = require("discord-akairo");

module.exports = class YeetCommand extends Command {
	constructor() {
		super("yeet", {
			name: "yeet",
			cooldown: 8000,
			aliases: ["yeet"],
			typing: true,
			description: { description: "Returns yeet..." },
		});
	}

	async exec(message) {
		const color = message.member.displayColor;
		await loadTitle(message);
		async function loadTitle() {
			fetch("https://www.reddit.com/r/YEET/.json?limit=1000&?sort=top&t=all")
				.then((res) => res.json())
				.then((json) => json.data.children.map((t) => t.data))
				.then((data) => postRandomTitle(data));
		}
		async function postRandomTitle(data) {
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
			return message.util.send(embed);
		}
	}
};
