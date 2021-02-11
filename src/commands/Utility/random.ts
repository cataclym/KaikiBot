import { MessageEmbed } from "discord.js";
import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";

module.exports = class RandomNumberCommand extends Command {
	constructor() {
		super("random", {
			description:  {
				usage: ["1 10", "25"],
				description: "Sends a random number between your two inputs.",
			},
			args: [{
				id: "int",
				type: "integer",
				default: 1,
			},
			{
				id: "int2",
				type: "integer",
				default: 100,
			}],
			aliases: ["random", "rng"],
		});
	}
	public async exec(message: Message, args: { int: number, int2: number }) {
		const embed = new MessageEmbed({
			title: "Result:",
			color: await message.getMemberColorAsync(),
		});
		function getRndInteger(min: number, max: number) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		const number1 = args.int,
			number2 = args.int2;
		embed.setFooter(`Random number between ${number1} and ${number2}`);
		if (number1 > number2) {
			embed.setDescription(getRndInteger(number2, number1));
		}
		else {
			embed.setDescription(getRndInteger(number1, number2));
		}
		return message.util?.send(embed);

	}
};