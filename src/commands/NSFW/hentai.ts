import { Message } from "discord.js";
import { grabHentai, typesArray, postHentai } from "./hentaiService";
import { KaikiCommand } from "kaiki";


export default class HentaiCommand extends KaikiCommand {
	constructor() {
		super("hentai", {
			aliases: ["hentai"],
			description: "Fetches hentai images from Booru boards",
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

		if (!tags) {
			return message.channel.send(await grabHentai(typesArray[Math.floor(Math.random() * typesArray.length)], "single"));
		}

		const messageArguments: string[] | undefined = tags?.split(/ +/);
		return postHentai(message, messageArguments);
	}
}
