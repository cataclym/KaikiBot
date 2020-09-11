const { fetchUserList } = require("../../functions/tinder.js");
const { Command, Flag, Argument } = require("discord-akairo");

module.exports = class TinderListCommand extends Command {
	constructor() {
		super("tinderlist", {
			id: "tinderlist",
			aliases: ["tinderlist"],
		});
	}
	*args() {
		const method = yield {
			type: [
				["tinderlistlikes", "like", "l", "likes"],
				["tinderlistdislikes", "dislike", "dl", "dislikes"],
				["tinderlistdates", "date", "d", "dates", "dating"],
				["tinderlistmarries", "marry", "s", "married", "marries", "spouses"],
			],
		};
		if (!Argument.isFailure(method)) {
			return Flag.continue(method);
		}
	}

	async exec(message) {
		return fetchUserList(message, message.author);
	}
};
