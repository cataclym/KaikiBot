import fetch from "node-fetch";
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util";

export default class RedditCommand extends Command {
	constructor() {
		super("reddit", {
			cooldown: 8000,
			aliases: ["reddit"],
			typing: true,
			description: { description: "Returns a random reddit post, from a specified subreddit.", usage: "anime" },
			args: [
				{
					id: "sub",
					match: "rest",
					default: "anime",
				},
			],
		});
	}

	public async exec(message: Message, { sub }: { sub: string }): Promise<Message | void> {

		loadTitle();
		const color = await getMemberColorAsync(message);

		async function loadTitle() {
			const promise = async () => fetch(`https://www.reddit.com/r/${sub}/random/.json?limit=1000&?sort=top&t=all`);
			promise()
				.then((res) => res.json())
				.then((json) => json[0].data.children.map((t: any) => t.data))
				.then((data: any) => postRandomTitle(data));
		}
		async function postRandomTitle(data: any) {

			data = data[0];

			console.log(data);
			console.log(typeof (data));

			const embed = new Discord.MessageEmbed({
				color: color,
				author: {
					name: `Submitted by ${data.author}`,
					url: data.url,
				},
				footer: { text: `${data.ups} updoots / ${data.downs} downdoots` },
			});
			data.title?.length ? embed.setTitle(data.title.substring(0, 256)) : null;
			data.selftext?.length ? embed.setDescription(data.selftext.substring(0, 2047)) : null;
			!data.is_video ? embed.setImage(data.url) : message.channel.send(data.url);

			return message.util?.send(embed);
		}
	}
}
