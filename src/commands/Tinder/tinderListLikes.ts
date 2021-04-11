import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { separateTinderList } from "../../nsb/Tinder.js";
import { getTinderDB } from "../../struct/db.js";

module.exports = class TinderListLikesCommand extends Command {
	constructor() {
		super("tinderlistlikes", {
		});
	}
	public async exec(message: Message) {
		const db = await getTinderDB(message.author.id),
			likeIDs = [...new Set(db.likeIDs)];
		return separateTinderList(message, likeIDs, `Likes (${likeIDs.length - 1})`);
	}
};