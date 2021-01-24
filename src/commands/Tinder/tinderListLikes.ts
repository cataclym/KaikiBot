import db from "quick.db";
const Tinder = new db.table("Tinder");
import { SeparateTinderList } from "../../nsb/Tinder.js";
import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";

module.exports = class TinderListLikesCommand extends Command {
	constructor() {
		super("tinderlistlikes", {
		});
	}
	public async exec(message: Message) {
		const likesID = <string[]> [...new Set(Tinder.get(`${message.author.id}.likeID`))];
		return SeparateTinderList(message, likesID, `Likes (${likesID.length - 1})`);
	}
};