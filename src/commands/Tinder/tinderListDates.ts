import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { separateTinderList } from "../../lib/Tinder";
import { getTinderDocument } from "../../struct/documentMethods";

module.exports = class TinderListDatesCommand extends Command {
	constructor() {
		super("tinderlistdates", {
		});
	}

	public async exec(message: Message) {
		const db = await getTinderDocument(message.author.id),
			datingIDs = [...new Set(db.datingIDs)];
		return separateTinderList(message, datingIDs, `Dates (${datingIDs.length})`);
	}
};