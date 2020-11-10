import fetch from "node-fetch";
import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { errorColor, getMemberColorAsync, trim } from "../../functions/Util";
import { redditData, Data1 } from "../../struct/redditModel";

export default class RedditCommand extends Command {
	constructor() {
		super("reddit", {
			cooldown: 6000,
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
			const file: redditData = await fetch(`https://www.reddit.com/r/${sub}/random/.json`)
				.then(response => response.json());
			if (file) {
				const data = file.data.children?.map(a => a.data);
				if (data) {
					return postRandomTitle(data[Math.floor(Math.random() * data.length) + 1]);
				}
			}
			else {
				return message.util?.send(new MessageEmbed({
					title: "Error",
					description: "No data received...",
					color: errorColor,
				}));
			}
		}

		async function postRandomTitle(data: Data1) {

			const embed = new MessageEmbed({
				color: color,
				author: {
					name: `Submitted by ${data.author}`,
					url: data.url,
				},
				footer: { text: `${data.ups} updoots / ${data.upvote_ratio} updoot ratio` },
			});

			data.title?.length ? embed.setTitle(trim(data.title, 256)) : null;
			data.selftext?.length ? embed.setDescription(trim(data.selftext, 2047)) : null;
			!data.is_video ? embed.setImage(data.url) : message.channel.send(data.url);

			return message.util?.send(embed);
		}
	}
}
