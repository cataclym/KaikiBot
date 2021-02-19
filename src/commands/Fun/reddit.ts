import fetch from "node-fetch";
import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { trim } from "../../nsb/Util";
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

	public async exec(message: Message, { sub }: { sub: string }): Promise<Message> {

		return (async function loadTitle() {
			const file: redditData = await fetch(`https://www.reddit.com/r/${sub}/random/.json`)
				.then(response => response.json());
			if (file?.data?.children?.length) {
				const data = file.data.children.map(a => a.data);
				return postRandomTitle(data[Math.floor(Math.random() * data.length)]);
			}
			else {
				return message.channel.send(new MessageEmbed({
					title: "Error",
					description: "No data received...",
				})
					.withErrorColor(message));
			}
		})();

		async function postRandomTitle(data: Data1) {

			// We don´t want nsfw in normal channels, do we?
			if (data.over_18 && (!(message.channel as TextChannel)?.nsfw ||	message.channel.type !== "dm")) {
				return message.channel.send(new MessageEmbed({
					title: "This post is marked as NSFW",
					description: "Cannot show NSFW in DMs or non-NSFW channels",
				})
					.withErrorColor(message))
					.then(msg => msg.delete({ timeout: 7500 }));
			}

			const embed = new MessageEmbed({
				author: {
					name: `Submitted by ${data.author}`,
					url: data.url,
				},
				footer: { text: `${data.ups} updoots / ${data.upvote_ratio} updoot ratio` },
			})
				.withOkColor(message);

			if (data.title?.length) embed.setTitle(trim(data.title, 256));
			if (data.selftext?.length) embed.setDescription(trim(data.selftext, 2048));
			!data.is_video ? embed.setImage(data.url) : message.channel.send(data.url);

			return message.channel.send(embed);
		}
	}
}
