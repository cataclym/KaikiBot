import db from "quick.db";
const Tinder = new db.table("Tinder");
import { SeparateTinderList } from "../../util/tinder.js";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

module.exports = class TinderListDatesCommand extends Command {
	constructor() {
		super("tinderlistdates", {
		});
	}

	public async exec(message: Message) {
		const dating = <string[]> [...new Set(Tinder.get(`dating.${message.author.id}`))];
		return SeparateTinderList(message, dating, `Dates (${dating.length - 1})`);
	}
};