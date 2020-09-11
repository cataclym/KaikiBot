const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { SeparateTinderList } = require("../../functions/tinder.js");
const { Command } = require("discord-akairo");

module.exports = class TinderListDatesCommand extends Command {
	constructor() {
		super("tinderlistdates", {
			id: "tinderlistdates",
			aliases: ["tinderlistdates"],
		});
	}

	async exec(message) {
		const dating = [...new Set(Tinder.get(`dating.${message.author.id}`))];
		return SeparateTinderList(message, dating, "Dates");
	}
};