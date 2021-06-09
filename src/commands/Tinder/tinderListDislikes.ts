import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { separateTinderList } from "../../lib/Tinder";
import { getTinderDocument } from "../../struct/documentMethods";

module.exports = class TinderListDislikesCommand extends Command {
	constructor() {
		super("tinderlistdislikes", {
		});
	}
	public async exec(message: Message) {
		const db = await getTinderDocument(message.author.id),
			dislikeIDs = [...new Set(db.dislikeIDs)];
		return separateTinderList(message, dislikeIDs, `Dislikes (${dislikeIDs.length - 1})`);
	}
};