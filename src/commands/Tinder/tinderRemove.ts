import { Argument, ArgumentOptions, Command, Flag, PrefixSupplier } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";

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
			otherwise: (m: Message) => (message: Message) => new MessageEmbed()
				.setDescription("Provide a list to remove an item from: [`dislikes`, `likes`, `dates`, `marries`] \nExample: `" + (this.handler.prefix as PrefixSupplier)(message) + "tinder remove dislikes 69`")
				.withErrorColor(m),
		};
		if (!Argument.isFailure(method)) {return Flag.continue(method);}
	}
	public async exec(): Promise<void> {
		throw new Error("Error: Fell through in " + this.filepath);
	}
}

