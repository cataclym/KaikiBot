import { Command } from "discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";

export default class WoofCommand extends Command {
	constructor() {
		super("woof", {
			aliases: ["woof"],
			description: { description: "Woof.", usage: "" },
		});
	}
	public async exec(message: Message): Promise<Message | void> {

		const file = await fetch("https://dog.ceo/api/breeds/image/random")
			.then(response => response.json());
		if (file) {
			return message.channel.send(file.message);
		}
	}
}