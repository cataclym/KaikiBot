import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { separateTinderList } from "../../lib/Tinder";
import { getTinderDocument } from "../../struct/db";

module.exports = class TinderListLikesCommand extends Command {
	constructor() {
		super("tinderlistlikes", {
		});
	}
	public async exec(message: Message) {
		const db = await getTinderDocument(message.author.id),
			likeIDs = [...new Set(db.likeIDs)];
		return separateTinderList(message, likeIDs, `Likes (${likeIDs.length - 1})`);
	}
};