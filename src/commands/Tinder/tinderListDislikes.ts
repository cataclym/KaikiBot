import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { separateTinderList } from "../../lib/Tinder.js";
import { getTinderDB } from "../../struct/db.js";

module.exports = class TinderListDislikesCommand extends Command {
	constructor() {
		super("tinderlistdislikes", {
		});
	}
	public async exec(message: Message) {
		const db = await getTinderDB(message.author.id),
			dislikeIDs = [...new Set(db.dislikeIDs)];
		return separateTinderList(message, dislikeIDs, `Dislikes (${dislikeIDs.length - 1})`);
	}
};