import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Tinder = new db.table("Tinder");
import { SeparateTinderList } from "../../functions/tinder.js";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

module.exports = class TinderListDislikesCommand extends Command {
	constructor() {
		super("tinderlistdislikes", {
		});
	}
	async exec(message: Message) {
		const dislikeID = <string[]> [...new Set(Tinder.get(`dislikeID.${message.author.id}`))];
		return SeparateTinderList(message, dislikeID, `Dislikes (${dislikeID.length - 1})`);
	}
};