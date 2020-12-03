import { MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { getMemberColorAsync } from "../../util/Util.js";

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
	public async exec(message: Message, args: any) {
		const color = await getMemberColorAsync(message),
			embed = new MessageEmbed({
				title: "Result:",
				color,
			});
		function getRndInteger(min: number, max: number) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		const number1 = parseInt(args.int, 10),
			number2 = parseInt(args.int2, 10);
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