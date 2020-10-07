import { Command } from "discord-akairo";
import { Message } from "discord.js";

module.exports = class ReloadCommand extends Command {
	constructor() {
		super("reload", {
			aliases: ["re", "reload"],
			description: { description: "Reloads a command" },
			ownerOnly: true,
		});
	}
	async exec(message: Message, args: any) {
		return;
		// TODO: Convert to Akairo reload
	}
};