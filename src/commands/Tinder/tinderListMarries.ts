import { separateTinderList } from "../../nsb/Tinder.js";
import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { getTinderDB } from "../../struct/db.js";

module.exports = class TinderListMarriesCommand extends Command {
	constructor() {
		super("tinderlistmarries", {
		});
	}

	public async exec(message: Message) {
		const db = await getTinderDB(message.author.id),
			marriedIDs = [...new Set(db.tinderData.marriedIDs)];
		return separateTinderList(message, marriedIDs, `Spouses (${marriedIDs.length - 1})`);
	}
};