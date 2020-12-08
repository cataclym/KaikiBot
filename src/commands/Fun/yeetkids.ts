import fetch from "node-fetch";
import Discord from "discord.js";
import { Command } from "discord-akairo";
import { GuildMember, Message } from "discord.js";
import { trim } from "../../util/Util";
import { ChildrenEntity, Data1 } from "../../struct/redditModel";

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
				.then((json) => json.data.children.map((t: ChildrenEntity) => t.data))
				.then((data) => postRandomTitle(data));
		}

		async function postRandomTitle(data: Data1[]) {

			const randomRedditPost = data[Math.floor(Math.random() * data.length) + 1];

			const filters = ["webm", "mp4", "gifv", "youtube", "v.redd", "gfycat", "youtu", "news", "wsbtv"];
			// Yes.
			const isVideo = () => {
				if (filters.some((filter) => randomRedditPost.url.includes(filter))) {
					return true;
				}
				return false;
			};

			const yeetEmbed = new Discord.MessageEmbed()
				.setTitle(trim(randomRedditPost.title, 256))
				.setDescription(trim(randomRedditPost.selftext, 2048))
				.setColor(await (message.member as GuildMember).getMemberColorAsync())
				.setAuthor(`Submitted by ${randomRedditPost.author}`)
				.setImage(randomRedditPost.url)
				.setFooter(`${randomRedditPost.ups} updoots`);

			isVideo() ? await message.util?.send(randomRedditPost.url) : "";

			return message.util?.send("", { split: true, embed: yeetEmbed });
		}
	}
}
