import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { Image } from "kaori/typings/Image";
import { errorMessage } from "../../lib/Embeds";
import { codeblock } from "../../lib/Util";
import { grabHentaiPictureAsync, grabHentai, typesArray, DapiGrabber, DapiSearchType } from "./hentaiService";

export default class E621Command extends Command {
	constructor() {
		super("e621", {
			aliases: ["e621"],
			description: { description: "e621 :hahaa:" },
			typing: true,
			args: [{
				id: "tags",
				match: "rest",
				type: "string",
				default: null,
			}],
		});
	}
	public async exec(message: Message, { tags }: { tags: string | null }): Promise<Message> {
		const posts = await DapiGrabber(tags?.split("+").map(tag => tag.replace(" ", "_")) ?? null, DapiSearchType.E621);
		if (posts) {
			return message.channel.send(await codeblock(posts.map(p => p.file.url).join(", "), "xl"));
		}
		else {
			return message.channel.send(await errorMessage(message, "No data received"));
		}
	}
}
