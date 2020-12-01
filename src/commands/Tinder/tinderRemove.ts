import { Argument, ArgumentOptions, Command, Flag } from "discord-akairo";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import { config } from "../../config";

export default class TinderRemove extends Command {
	constructor() {
		super("tinderremove", {
		});
	}
	*args(): IterableIterator<(ArgumentOptions | Flag)> {
		const method = yield {
			type: [
				["tinderremovedislikes", "dislikes", "dl", "dislike"],
				["tinderremovelikes", "likes", "l", "like"],
				["tinderremovedates", "dates", "d", "dating", "date"],
				["tinderremovemarries", "married", "marries", "spouses", "s", "m"],
			],
			otherwise: new MessageEmbed().setDescription("Provide a list to remove an item from: [`dislikes`, `likes`, `dates`, `marries`] \nExample: `" + config.prefix + "tinder remove dislikes 69`").setColor("#ff0000"),
		};
		if (!Argument.isFailure(method)) {return Flag.continue(method);}
	}
	public async exec(message: Message): Promise<Message | void> {
		message.util?.send("Fell through");
		throw new Error("Error: Fell through in " + this.filepath);
	}
}

