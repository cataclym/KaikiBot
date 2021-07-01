import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";

export default class WoofCommand extends Command {
	constructor() {
		super("woof", {
			aliases: ["woof"],
			description: { description: "Woof.", usage: "" },
		});
	}
	public async exec(message: Message): Promise<Message | void> {

		return message.channel.send({ embeds: [new MessageEmbed()
			.setImage((await fetch("https://dog.ceo/api/breeds/image/random")
				.then(response => response.json())).message)
			.withOkColor(message)],
		});
	}
}
