import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { separateTinderList } from "../../lib/Tinder";
import { getTinderDB } from "../../struct/db";

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