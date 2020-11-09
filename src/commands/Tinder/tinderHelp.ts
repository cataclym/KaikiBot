import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { TinderHelp } from "../../functions/embeds";

module.exports = class TinderHelpCommand extends Command {
	constructor() {
		super("tinderhelp", {
			aliases: ["tinderhelp"],
		});
	}
	public async exec(message: Message) {
		return message.util?.send(TinderHelp);
	}
};