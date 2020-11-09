import fetch from "node-fetch";
import Discord from "discord.js";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { getMemberColorAsync, trim } from "../../functions/Util";

export default class YeetCommand extends Command {
	constructor() {
		super("yeetkids", {
			cooldown: 8000,
			aliases: ["yeetkids"],
			typing: true,
			description: { description: "Returns yeet..." },
		});
	}

	public async exec(message: Message): Promise<Message | void> {

		await loadTitle();
		async function loadTitle() {
			const promise = async () => fetch("https://www.reddit.com/r/YeetingKids/.json?limit=1000&?sort=top&t=all");
			promise()
				.then((res) => res.json())
				.then((json) => json.data.children.map((t: any) => t.data))
				.then((data) => postRandomTitle(data));
		}

		async function postRandomTitle(data: any) {
			const randomRedditPost = data[Math.floor(Math.random() * data.length) + 1];
			const randomTitleSelfText = trim(randomRedditPost.selftext, 2048);
			const RTTitle = trim(randomRedditPost.title, 256);

			let RTUrl = randomRedditPost.url.toString();
			const filters = ["webm", "mp4", "gifv", "youtube", "v.redd", "gfycat", "youtu", "news", "wsbtv"];
			// Yes.
			if (filters.some((filter) => RTUrl.includes(filter))) {
				RTUrl = undefined;
			}

			const yeetEmbed = new Discord.MessageEmbed()
				.setTitle(RTTitle)
				.setDescription(randomTitleSelfText)
				.setColor(await getMemberColorAsync(message))
				.setAuthor(`Submitted by ${randomRedditPost.author}`)
				.setImage(RTUrl)
				.setFooter(`${randomRedditPost.ups} updoots`);

			await message.util?.send("", { split: true, embed: yeetEmbed, content: (!RTUrl ? randomRedditPost.url : "") });
		}
	}
}
