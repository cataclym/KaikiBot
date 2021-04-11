import { Command } from "@cataclym/discord-akairo";
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

		return message.channel.send((await fetch("https://dog.ceo/api/breeds/image/random")
			.then(response => response.json())).message);
	}
}