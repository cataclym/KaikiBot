import { fetchUserList } from "../../functions/tinder.js";
import { Command, Flag, Argument } from "discord-akairo";
import { Message, User } from "discord.js";

module.exports = class TinderListCommand extends Command {
	constructor() {
		super("tinderlist", {
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
		const user = yield {
			type: "user",
			flag: ["u", "-u"],
			default: (message: Message) => message.author,
		};
		return user;
	}

	public async exec(message: Message, args: User) {

		return fetchUserList(message, args);
	}
};
