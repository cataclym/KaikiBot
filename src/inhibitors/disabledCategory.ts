import { Command, Inhibitor } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { blockedModulesCache } from "../cache/cache";
import { getGuildDB } from "../struct/db";

export default class BlockModulesInhibitor extends Inhibitor {
	constructor() {
		super("blockmodules", {
			reason: "blocked module",
		});
	}

	async exec(message: Message, command: Command): Promise<boolean> {

		if (message.guild) {
			if (!(message.guild.id in blockedModulesCache)) {
				blockedModulesCache[message.guild.id] = (await getGuildDB(message.guild.id)).blockedCategories;
			}

			if (command.id === "togglecategory") return false;

			return (blockedModulesCache[message.guild.id])[command.category.id];
		}
		return false;
	}
}