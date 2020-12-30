import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { TinderHelp } from "../../util/embeds";

export default class TinderHelpCommand extends Command {
	constructor() {
		super("tinderhelp", {
			aliases: ["tinderhelp"],
		});
	}
	public async exec(message: Message): Promise<Message | void> {
		return message.util?.send(TinderHelp(message, this));
	}
}