import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { grabHentai, typesArray } from "./hentaiService";

export default class HentaiBombCommand extends Command {
	constructor() {
		super("hentainuke", {
			aliases: ["hentainuke", "hn"],
			description: { description: "Posts 30 NSFW images, using the waifu.pics API",
				usage: typesArray },
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
			await message.channel.send(megaResponse.slice(p, index));
		}
	}
}