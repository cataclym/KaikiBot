import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Tinder = new db.table("Tinder");
import { SeparateTinderList } from "../../functions/tinder.js";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

module.exports = class TinderListMarriesCommand extends Command {
	constructor() {
		super("tinderlistmarries", {
			aliases: ["tinderlistmarries"],
		});
	}

	async exec(message: Message) {
		const married = <string[]> [...new Set(Tinder.get(`married.${message.author.id}`))];
		return SeparateTinderList(message, married, `Spouses (${married.length - 1})`);
	}
};