import db from "quick.db";
const Tinder = new db.table("Tinder");
import { SeparateTinderList } from "../../nsb/Tinder.js";
import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";

module.exports = class TinderListDatesCommand extends Command {
	constructor() {
		super("tinderlistdates", {
		});
	}

	public async exec(message: Message) {
		const datingIDs = <string[]> [...new Set(Tinder.get(`${message.author.id}.datingIDs`))];
		return SeparateTinderList(message, datingIDs, `Dates (${datingIDs.length - 1})`);
	}
};