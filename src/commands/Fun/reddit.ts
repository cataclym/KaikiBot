import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import fetch from "node-fetch";
import { PurpleData, RedditData } from "../../interfaces/IRedditAPI";
import { trim } from "../../nsb/Util";

export default class RedditCommand extends Command {
	constructor() {
		super("reddit", {
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

		const promise = async () => fetch(`https://www.reddit.com/r/${sub.trim()}/random/.json`);

		return await promise()
			.then(response => response.json())
			.then((json: RedditData | RedditData[]) => Array.isArray(json) ? json[0].data.children.map((t) => t.data) : json.data.children.map((t) => t.data))
			.then((data) => postRandomTitle(data[Math.floor(Math.random() * data.length)]));

		async function postRandomTitle(data: PurpleData) {

			if (!data) {
				return message.channel.send(new MessageEmbed({
					title: "Error",
					description: "No data received...",
				})
					.withErrorColor(message));
			}

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
			!data.is_video && data.url?.length ? embed.setImage(data.url) : message.channel.send(data.url ?? data.permalink);

			return message.channel.send(embed);
		}
	}
}
