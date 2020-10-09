import { Command, Listener } from "discord-akairo";
import { Message } from "discord.js";

module.exports = class errorListener extends Listener {
	constructor() {
		super("error", {
			event: "error",
			emitter: "commandHandler",
		});
	}

	public async exec(error: Error, message: Message, command: Command) {
		if (message.channel.type !== "dm") {
			console.log(`🔴 Error: ${message.guild?.name} | ${message.channel.name} | ${message.author.username} executed ${command?.id}\n🔴 ${error.stack}\n${error}`);
		}
	}
};

