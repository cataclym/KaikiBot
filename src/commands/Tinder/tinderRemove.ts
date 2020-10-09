import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import { config } from "../../config";

module.exports = class TinderRemove extends Command {
	constructor() {
		super("tinderremove", {
		});
	}
	*args() {
		const method = yield {
			type: [
				["tinderremovedislikes", "dislikes", "dl", "dislike"],
				["tinderremovelikes", "likes", "l", "like"],
				["tinderremovedates", "dates", "d", "dating", "date"],
				["tinderremovemarries", "married", "marries", "spouses", "s", "m"],
			],
			otherwise: new MessageEmbed().setDescription("Provide a list to remove an item from: [`dislikes`, `likes`, `dates`, `marries`] \nExample: `" + config.prefix + "tinder remove dislikes 69`").setColor("#ff0000"),
		};
		return Flag.continue(method);
	}
	async exec(message: Message) {
		message.util?.send("Fell through");
		throw new Error("Error: Fell through in " + this.filepath);
	}
};

