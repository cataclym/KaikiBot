import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { Image } from "kaori/typings/Image";
import { grabHentaiPictureAsync, grabHentai, typesArray } from "./hentaiService";

export default class HentaiCommand extends Command {
	constructor() {
		super("hentai", {
			aliases: ["hentai"],
			description: { description: "Fetches hentai images from Booru boards" },
			typing: true,
			args: [{
				id: "tags",
				match: "rest",
				type: "string",
				default: null,
			}],
		});
	}
	public async exec(message: Message, { tags }: { tags: string }): Promise<Message> {
		if (message.channel.type === "text" && message.channel.nsfw) {
			if (!tags) {
				return message.channel.send(await grabHentai(typesArray[Math.floor(Math.random() * typesArray.length)], "single"));
			}

			const messageArguments: string[] | undefined = tags?.split(/ +/);
			return postHentai(messageArguments);
		}
		else {
			return message.channel.send(new MessageEmbed({
				title: "Error",
				description: "Channel is not NSFW.",
			})
				.withErrorColor(message));
		}
		async function postHentai(messageArguments: string[] | undefined): Promise<Message> {
			const awaitResult = async () => (await grabHentaiPictureAsync(messageArguments));
			const result: Image = await awaitResult();
			if (result) {
				return message.channel.send(result.sampleURL, new MessageEmbed({
					author: { name: result.createdAt?.toLocaleString() },
					title: "Score: " + result.score,
					description: `[Source](${result.source} "${result.source}")`,
					image: { url: <string | undefined> result.fileURL || result.sampleURL || result.previewURL },
					footer: { text: result.tags.join(", ") },
				})
					.withOkColor(message));
			}
			else {
				return postHentai(messageArguments);
			}
		}
	}
}
