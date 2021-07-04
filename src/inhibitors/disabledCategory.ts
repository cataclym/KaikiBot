import { Command, Inhibitor } from "discord-akairo";
import { Message } from "discord.js";
import { getGuildDocument } from "../struct/documentMethods";
export default class BlockModulesInhibitor extends Inhibitor {
	constructor() {
		super("blockmodules", {
			reason: "blocked module",
		});
	}

	async exec(message: Message, command: Command): Promise<boolean> {

		if (message.guild) {

			if (command.id === "togglecategory") return false;

			return (await getGuildDocument(message.guild.id)).blockedCategories[command.category.id];
		}
		return false;
	}
}
