import db from "quick.db";
const Tinder = new db.table("Tinder");
import { SeparateTinderList } from "../../nsb/Tinder.js";
import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";

module.exports = class TinderListDislikesCommand extends Command {
	constructor() {
		super("tinderlistdislikes", {
		});
	}
	public async exec(message: Message) {
		const dislikeIDs = [...new Set(Tinder.get(`${message.author.id}.dislikeIDs`))] as string[];
		return SeparateTinderList(message, dislikeIDs, `Dislikes (${dislikeIDs.length - 1})`);
	}
};