const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { SeparateTinderList } = require("../../functions/tinder.js");
const { Command } = require("discord-akairo");

module.exports = class TinderListDislikesCommand extends Command {
	constructor() {
		super("tinderlistdislikes", {
			id: "tinderlistdislikes",
			aliases: ["tinderlistdislikes"],
		});
	}
	async exec(message) {
		const dislikeID = [...new Set(Tinder.get(`dislikeID.${message.author.id}`))];
		return SeparateTinderList(message, dislikeID, `Dislikes (${dislikeID.length - 1})`);
	}
};