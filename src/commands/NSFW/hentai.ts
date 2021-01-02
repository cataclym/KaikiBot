import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { Image } from "kaori/typings/Image";
import { errorColor } from "../../nsb/Util";
import { grabHentaiPictureAsync } from "./hentaiService";

export default class HentaiCommand extends Command {
	constructor() {
		super("hentai", {
			aliases: ["hentai"],
			description: { description: "Fetches hentai images from" },
			typing: true,
			args: [{
				id: "tags",
				match: "rest",
				type: "string",
			}],
		});
	}
	public async exec(message: Message, { tags }: { tags: string }): Promise<Message | void> {
		if (message.channel.type === "text" && message.channel.nsfw) {
			const messageArguments: string[] | undefined = tags?.split(/ +/);
			postHentai(messageArguments);
		}
		else {
			return message.channel.send(new MessageEmbed({
				title: "Error",
				description: "Channel is not NSFW.",
				color: errorColor,
			}));
		}
		async function postHentai(messageArguments: string[] | undefined): Promise<Message | void> {
			const awaitResult = async () => (await grabHentaiPictureAsync(messageArguments));
			const result: Image = await awaitResult();
			if (result) {
				return message.util?.send(result.sampleURL, new MessageEmbed({
					author: { name: result.createdAt?.toLocaleString() },
					title: "Score: " + result.score,
					description: `[Source](${result.source} "${result.source}")`,
					image: { url: <string | undefined> result.fileURL || result.sampleURL || result.previewURL },
					footer: { text: result.tags.join(", ") },
					color: await message.getMemberColorAsync(),
				}));
			}
			else {
				return postHentai(messageArguments);
			}
		}
	}
}
