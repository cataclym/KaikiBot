import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { Image } from "kaori/typings/Image";
import { getMemberColorAsync } from "../../functions/Util";
import { grabHentaiPictureAsync } from "./hentaiService";

export default class HentaiCommand extends Command {
	constructor() {
		super("hentai", {
			aliases: ["hentai"],
			description: { description: "Fetches hentai images from" },
			args: [{
				id: "tags",
				match: "rest",
				type: "string",
			}],
		});
	}
	public async exec(message: Message): Promise<Message | void> {
		try {
			if (message.channel.type === "text" && message.channel.nsfw) {

				const messageArguments: string[] = message.content.slice().split(/ +/);
				messageArguments.shift();
				console.log(messageArguments);
				const result: Image = (await grabHentaiPictureAsync(messageArguments.length ? messageArguments : undefined).catch((e: Error) => {
					throw e;
				}));
				await Promise.resolve(result);
				return message.util?.send(new MessageEmbed({
					author: { name: result.createdAt?.toLocaleString() },
					title: "Score: " + result.score,
					description: `[Source](${result.source} "${result.source}")`,
					image: { url: result.fileURL },
					footer: { text: result.tags.join(", ") },
					color: await getMemberColorAsync(message),
				}));
			}
			else {
				throw "Channel is not NSFW.";
			}
		}
		catch (e) {
			return console.error(e);
		}
	}
}