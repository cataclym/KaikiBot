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

			if (!(blockedModulesCache[message.guild.id])) blockedModulesCache[message.guild.id] = {};

			const category = command.categoryID;
			const blocked = (blockedModulesCache[message.guild.id])[category];

			if (blocked === undefined) {
				const db = await getGuildDB(message.guild.id);
				return (blockedModulesCache[message.guild.id])[category] = db.blockedCategories[category];
			}
			return blocked;
		}
		return false;
	}
}