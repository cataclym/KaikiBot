import { Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "kaiki";
import { IMoneyService } from "../../lib/money/IMoneyService";
import { MongoMoney } from "../../lib/money/MongoMoneyService";

export default class BetRollCommand extends KaikiCommand {
	private readonly _money: IMoneyService;

	constructor() {
		super("betroll", {
			aliases: ["betroll", "br"],
			description: "Bet an amount of currency and roll the dice. Rolling above 66 yields x2 the amount bet. Above 90 - x4 and 100 gives x10!",
			usage: "69",
			args: [{
				id: "number",
				type: "integer",
				otherwise: (m) => ({
					embeds: [new MessageEmbed()
						.setDescription("Please provide an amount to bet!")
						.withErrorColor(m)],
				}),
			}],
		});
		this._money = MongoMoney;
	}

	public async exec(message: Message, { number }: { number: number }): Promise<Message> {
		const success = await this._money.TryTake(message.author.id, number);

		if (!success) {
			return await message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`You don't have enough ${this._money.currencySymbol}`)
					.withErrorColor(message)],
			});
		}

		// Gives a random number between 0-100
		const roll = Math.round(Math.random() * 100);

		if (roll < 66) {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`🎲 You rolled \`${roll}\`. Better luck next time!`)
					.withOkColor(message)],
			});
		}

		else if (roll < 90) {

			const winnings = Math.round(number * 2);

			await this._money.Add(message.author.id, winnings);

			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`🎲 You rolled \`${roll}\`, and won ${winnings} ${this._money.currencySymbol} for rolling above 66`)
					.withOkColor(message)],
			});
		}

		else if (roll < 100) {

			const winnings = Math.round(number * 4);

			await this._money.Add(message.author.id, winnings);

			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`🎲 You rolled \`${roll}\`, and won ${winnings} ${this._money.currencySymbol} for rolling above 90`)
					.withOkColor(message)],
			});
		}

		else {

			const winnings = Math.round(number * 10);

			await this._money.Add(message.author.id, winnings);

			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`🎲 You rolled \`${roll}\`!!! You won ${winnings} ${this._money.currencySymbol} for rolling above 99`)
					.withOkColor(message)],
			});
		}
	}
}
