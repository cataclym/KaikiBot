import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import sendWaifuPics from "./waifuPics";

export default class Neko extends Command {
	constructor() {
		super("neko", {
			aliases: ["neko"],
			description: { description: "Spawn a neko picture", usage: [""] },
			typing: true,
		});
	}
	public async exec(message: Message): Promise<Message> {
		return message.channel.send(await sendWaifuPics(message, "neko"));
	}
}