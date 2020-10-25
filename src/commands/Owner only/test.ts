import { Command } from "discord-akairo";
import { Message } from "discord.js";

module.exports = class TestCommand extends Command {
	constructor() {
		super("test", {
			aliases: ["test"],
			cooldown: 3000,
			ratelimit: 1,
			ownerOnly: false,
		});
	}
	async exec(message: Message) {
		await message.channel.send("test message").then((thing)=> thing.react("❌").then(() => thing.react("💚").then(() => thing.react("🌟"))));

	}
};
