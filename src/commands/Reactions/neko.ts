import { Message } from "discord.js";
import sendWaifuPics from "../../lib/waifuPics";
import { KaikiCommand } from "Kaiki";

export default class Neko extends KaikiCommand {
	constructor() {
		super("neko", {
			aliases: ["neko"],
			description: "Spawn a neko picture",
			usage: [""],
			typing: true,
		});
	}

	public async exec(message: Message): Promise<Message> {
		return message.channel.send({ embeds: [await sendWaifuPics(message, "neko")] });
	}
}
