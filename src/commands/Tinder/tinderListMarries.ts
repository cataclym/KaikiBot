import db from "quick.db";
const Tinder = new db.table("Tinder");
import { SeparateTinderList } from "../../nsb/Tinder.js";
import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";

module.exports = class TinderListMarriesCommand extends Command {
	constructor() {
		super("tinderlistmarries", {
		});
	}

	public async exec(message: Message) {
		const marriedIDs = <string[]> [...new Set(Tinder.get(`${message.author.id}.marriedIDs`))];
		return SeparateTinderList(message, marriedIDs, `Spouses (${marriedIDs.length - 1})`);
	}
};