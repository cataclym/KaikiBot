import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class MeowCommand extends KaikiCommand {
	constructor() {
		super("meow", {
			aliases: ["meow"],
			description: "Meow.",
			usage: "",
		});
	}
	public async exec(message: Message): Promise<Message | void> {

		return message.channel.send({
			embeds: [new MessageEmbed()
				.setImage((await fetch("https://aws.random.cat/meow")
					.then(response => response.json())).file)
				.withOkColor(message)],
		});
	}
}
