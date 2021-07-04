import { Message } from "discord.js";
import sendWaifuPics from "../../lib/waifuPics";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class Waifu extends KaikiCommand {
	constructor() {
		super("waifu", {
			aliases: ["waifu"],
			description: "Spawn a waifu picture",
			usage: [""],
			typing: true,
		});
	}

	public async exec(message: Message): Promise<Message> {
		return message.channel.send({ embeds: [await sendWaifuPics(message, "waifu")] });
	}
}
