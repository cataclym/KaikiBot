const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { SeparateTinderList } = require("../../functions/tinder.js");
const { Command } = require("discord-akairo");

module.exports = class TinderListMarriesCommand extends Command {
	constructor() {
		super("tinderlistmarries", {
			id: "tinderlistmarries",
			aliases: ["tinderlistmarries"],
		});
	}

	async exec(message) {
		const married = [...new Set(Tinder.get(`married.${message.author.id}`))];
		return SeparateTinderList(message, married, "Spouses");
	}
};