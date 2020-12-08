import { Command } from "discord-akairo";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import { Image } from "kaori/typings/Image";
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
			throw new Error ("Channel is not NSFW.");
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
					color: await (message.member as GuildMember).getMemberColorAsync(),
				}));
			}
			else {
				return postHentai(messageArguments);
			}
		}
	}
}
