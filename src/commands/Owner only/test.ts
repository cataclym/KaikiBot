import { Command } from "discord-akairo";
import { Message } from "discord.js";
const reactions = ["🟥", "🟧", "🟩"];
module.exports = class TestCommand extends Command {
	constructor() {
		super("test", {
			aliases: ["test"],
			ownerOnly: true,
		});
	}
	async exec(message: Message) {
		console.time("React");
		const thing = await message.channel.send("test message");
		await Promise.all(reactions.map(async (reaction) => {
			thing.react(reaction);
			console.timeLog("React");
		}));
		console.timeEnd("React");
	}
};
