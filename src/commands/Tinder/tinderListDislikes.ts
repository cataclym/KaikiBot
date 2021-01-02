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
		const dislikeID = <string[]> [...new Set(Tinder.get(`dislikeID.${message.author.id}`))];
		return SeparateTinderList(message, dislikeID, `Dislikes (${dislikeID.length - 1})`);
	}
};