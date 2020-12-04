/* eslint-disable indent */
import { Command, Listener } from "discord-akairo";
import { Message } from "discord.js";

export default class errorListener extends Listener {
	constructor() {
		super("error", {
			event: "error",
			emitter: "commandHandler",
		});
	}

	public async exec(error: Error, message: Message, command: Command): Promise<void> {
		const date = new Date().toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", year: "numeric", month: "numeric", day: "numeric" });

		if (message.channel.type !== "dm") {
			console.warn(
	`🔴	${date} CommandFinished | ${Date.now() - message.createdTimestamp}ms
	Guild: ${message.guild?.name} [${message.guild?.id}]
	Channel: #${message.channel.name} [${message.channel.id}]
	User: ${message.author.username} [${message.author.id}]
	Executed ${command?.id} | "${message.content}"\n` +
	`🔴 ${error.stack}`);
		}
		else {
			console.warn(
	`🔴	${date} CommandFinished | ${Date.now() - message.createdTimestamp}ms
	Channel: PRIVATE [${message.channel.id}]
	User: ${message.author.username} [${message.author.id}]
	Executed ${command?.id} | "${message.content}"\n` +
	`🔴 ${error.stack}`);
		}
	}
}

