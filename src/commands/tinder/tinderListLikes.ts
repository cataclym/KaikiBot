import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Tinder = new db.table("Tinder");
import { SeparateTinderList } from "../../functions/tinder.js";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

module.exports = class TinderListLikesCommand extends Command {
	constructor() {
		super("tinderlistlikes", {
			aliases: ["tinderlistlikes"],
		});
	}
	async exec(message: Message) {
		const likesID = <string[]> [...new Set(Tinder.get(`likeID.${message.author.id}`))];
		return SeparateTinderList(message, likesID, `Likes (${likesID.length - 1})`);
	}
};