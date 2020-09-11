const db = require("quick.db");
const Tinder = new db.table("Tinder");
const { SeparateTinderList } = require("../../functions/tinder.js");
const { Command } = require("discord-akairo");

module.exports = class TinderListLikesCommand extends Command {
	constructor() {
		super("tinderlistlikes", {
			id: "tinderlistlikes",
			aliases: ["tinderlistlikes"],
		});
	}
	async exec(message) {
		const likesID = [...new Set(Tinder.get(`likeID.${message.author.id}`))];
		return SeparateTinderList(message, likesID, "Likes");
	}
};