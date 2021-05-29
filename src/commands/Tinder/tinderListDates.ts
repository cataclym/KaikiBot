import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { separateTinderList } from "../../lib/Tinder";
import { getTinderDB } from "../../struct/db";

module.exports = class TinderListDatesCommand extends Command {
	constructor() {
		super("tinderlistdates", {
		});
	}

	public async exec(message: Message) {
		const db = await getTinderDB(message.author.id),
			datingIDs = [...new Set(db.datingIDs)];
		return separateTinderList(message, datingIDs, `Dates (${datingIDs.length})`);
	}
};