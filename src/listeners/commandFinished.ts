/* eslint-disable indent */
import { Command, Listener } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { logger } from "../nsb/Logger";

export default class commandFinishedListener extends Listener {
	constructor() {
		super("commandFinished", {
			event: "commandFinished",
			emitter: "commandHandler",
		});
	}

	public async exec(message: Message, command: Command): Promise<void> {
		const date = new Date().toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", year: "numeric", month: "numeric", day: "numeric" });

		logger.low(
	`🟢	${date} CommandFinished | ${Date.now() - message.createdTimestamp}ms
	Guild: ${message.guild?.name} [${message.guild?.id}]
	${message.channel.type !== "dm" ? `Channel: #${message.channel.name} [${message.channel.id}]` : ""}
	User: ${message.author.username} [${message.author.id}]
	Executed ${command?.id} | "${message.content}"`);
	}
}
