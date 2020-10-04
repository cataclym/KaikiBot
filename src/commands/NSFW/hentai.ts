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
			cooldown: 6000,
			typing: true,
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
				const result: Image = (await grabHentaiPictureAsync(messageArguments));
				if (result) {
					return message.util?.send(result.sampleURL, new MessageEmbed({
						author: { name: result.createdAt?.toLocaleString() },
						title: "Score: " + result.score,
						description: `[Source](${result.source} "${result.source}")`,
						image: { url: result.fileURL },
						footer: { text: result.tags.join(", ") },
						color: await getMemberColorAsync(message),
					}));
				}
				else {
					return message.util?.send("No images found...");
				}
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