import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import fetch from "node-fetch";

export default class MeowCommand extends Command {
	constructor() {
		super("meow", {
			aliases: ["meow"],
			description: { description: "Meow.", usage: "" },
		});
	}
	public async exec(message: Message): Promise<Message | void> {

		return message.channel.send((await fetch("https://aws.random.cat/meow")
			.then(response => response.json())).file);
	}
}