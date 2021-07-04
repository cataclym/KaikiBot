import { Message } from "discord.js";
import { grabHentai, typesArray } from "./hentaiService";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class HentaiBombCommand extends KaikiCommand {
	constructor() {
		super("hentainuke", {
			aliases: ["hentainuke", "hn"],
			description: "Posts 30 NSFW images, using the waifu.pics API",
			usage: typesArray,
			args: [
				{
					id: "category",
					type: typesArray,
					default: null,
				},
			],
		});
	}

	public async exec(message: Message, { category }: { category: "waifu" | "neko" | "trap" | "blowjob" | null }): Promise<void | Message> {

		const megaResponse = (await grabHentai(category ?? typesArray[Math.floor(Math.random() * typesArray.length)], "bomb"));

		for (let index = 5, p = 0; p < megaResponse.length; index += 5, p += 5) {
			await message.channel.send({ content: megaResponse.slice(p, index).join("\n") });
		}
	}
}
