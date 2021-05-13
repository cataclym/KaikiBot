import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import sendWaifuPics from "../../lib/waifuPics";

export default class Waifu extends Command {
	constructor() {
		super("waifu", {
			aliases: ["waifu"],
			description: { description: "Spawn a waifu picture", usage: [""] },
			typing: true,
		});
	}
	public async exec(message: Message): Promise<Message> {
		return message.channel.send(await sendWaifuPics(message, "waifu"));
	}
}