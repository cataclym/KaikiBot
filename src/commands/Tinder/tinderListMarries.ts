import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { separateTinderList } from "../../lib/Tinder";
import { getTinderDB } from "../../struct/db";

module.exports = class TinderListMarriesCommand extends Command {
	constructor() {
		super("tinderlistmarries", {
		});
	}

	public async exec(message: Message) {
		const db = await getTinderDB(message.author.id),
			marriedIDs = [...new Set(db.marriedIDs)];
		return separateTinderList(message, marriedIDs, `Spouses (${marriedIDs.length - 1})`);
	}
};