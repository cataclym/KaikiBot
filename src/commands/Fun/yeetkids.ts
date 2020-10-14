import fetch from "node-fetch";
import Discord from "discord.js";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util";

module.exports = class YeetCommand extends Command {
	constructor() {
		super("yeetkids", {
			cooldown: 8000,
			aliases: ["yeetkids"],
			typing: true,
			description: { description: "Returns yeet..." },
		});
	}

	async exec(message: Message) {
		await loadTitle();
		async function loadTitle() {
			const promise = async () => fetch("https://www.reddit.com/r/YeetingKids/.json?limit=1000&?sort=top&t=all");
			promise()
				.then((res) => res.json())
				.then((json) => json.data.children.map((t: any) => t.data))
				.then((data) => postRandomTitle(data));
		}
		async function postRandomTitle(data: any) {
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
				.setColor(await getMemberColorAsync(message))
				.setAuthor(`Submitted by ${randomTitle.author}`, "", "")
				.setImage(RTUrl)
				.setFooter(`${randomTitle.ups} updoots`);
			await message.util?.send("", { split: true, embed: yeetEmbed, content: (!RTUrl ? randomTitle.url : "") });
		}
	}
};
