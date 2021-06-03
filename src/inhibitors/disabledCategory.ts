import { Command, Inhibitor } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { getGuildDB } from "../struct/db";
export default class BlockModulesInhibitor extends Inhibitor {
	constructor() {
		super("blockmodules", {
			reason: "blocked module",
		});
	}

	async exec(message: Message, command: Command): Promise<boolean> {

		if (message.guild) {

			if (command.id === "togglecategory") return false;

			return !!(await getGuildDB(message.guild.id)).blockedCategories[command.category.id];
		}
		return false;
	}
}