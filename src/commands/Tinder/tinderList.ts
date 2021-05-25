import { Argument, Command, Flag } from "@cataclym/discord-akairo";
import { Message, User } from "discord.js";
import { fetchUserList } from "../../lib/Tinder";

module.exports = class TinderListCommand extends Command {
	constructor() {
		super("tinderlist", {
			aliases: ["tinderlist"],
		});
	}
	*args(): Generator<{
		type: string[][];
		flag?: undefined;
		default?: undefined;
	} | {
		type: string;
		flag: string[];
		default: (message: Message) => User;
	}, any, string> {
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
