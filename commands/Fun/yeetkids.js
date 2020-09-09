const fetch = require("node-fetch");
const Discord = require("discord.js");
const { Command } = require("discord-akairo");

module.exports = class YeetCommand extends Command {
	constructor() {
		super("yeetkids", {
			name: "yeetkids",
			cooldown: 8000,
			aliases: ["yeetkids"],
			typing: true,
			description: { description: "Returns yeet..." },
		});
	}

	async exec(message) {
		const color = message.member.displayColor;
		await loadTitle(message);
		async function loadTitle() {
			fetch("https://www.reddit.com/r/YeetingKids/.json?limit=1000&?sort=top&t=all")
				.then((res) => res.json())
				.then((json) => json.data.children.map((t) => t.data))
				.then((data) => postRandomTitle(data));
		}
		async function postRandomTitle(data) {
			const randomTitle = data[Math.floor(Math.random() * data.length) + 1];
			let randomRedditPost = randomTitle.selftext.substring(0, 2045);
			if (randomTitle.selftext.length > 2048) {
				randomRedditPost += "...";
			}
			const RTTitle = randomTitle.title.substring(0, 256);
			let RTUrl = randomTitle.url.toString();
			const filters = ["webm", "mp4", "gifv", "youtube", "v.redd", "gfycat", "youtu", "news", "wsbtv"];
			// Yes.
			if (filters.some((filter) => RTUrl.includes(filter))) {
				RTUrl = undefined;
			}
			const yeetEmbed = new Discord.MessageEmbed()
				.setTitle(RTTitle)
				.setDescription(randomRedditPost)
				.setColor(color)
				.setAuthor(`Submitted by ${randomTitle.author}`, "", "")
				.setImage(RTUrl)
				.setFooter(`${randomTitle.ups} updoots`);
			await message.util.send("", { split: true, embed: yeetEmbed, content: (!RTUrl ? randomTitle.url : "") });
		}
	}
};
