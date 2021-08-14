// import { Message, MessageEmbed } from "discord.js";
// import { playSlots } from "../../lib/gambling/gambling";
// import { IMoneyService } from "../../lib/money/IMoneyService";
// import { MongoMoney } from "../../lib/money/MongoMoneyService";
// import { KaikiCommand } from "kaiki";
//
//
// export default class slotsCommand extends KaikiCommand {
//
//     private readonly _money: IMoneyService;
//     constructor() {
//     	super("Slots", {
//     		aliases: ["slots", "slot"],
//     		description: "Bet a certan amount in the slot machine.",
//     		usage: "69",
//     		args: [
//     			{
//     				id: "amount",
//     				type: "integer",
//     				otherwise: (m: Message) => ({ embeds: [new MessageEmbed()
//     					.setTitle("Invalid amount. It must be a number")
//     					.withOkColor(m)] }),
//     			},
//     		],
//     	});
//     	this._money = MongoMoney;
//     }
//
//     public async exec(message: Message, { amount }: { amount: number }): Promise<void> {
//
//     	if (amount < 2) {
//     		await message.channel.send({
//     			embeds: [new MessageEmbed()
//     				.setDescription(`You need to bet more than 2 ${this._money.currencySymbol}`)
//     				.withErrorColor(message)],
//     		});
//     		return;
//     	}
//
//     	const success = await this._money.TryTake(message.author.id, amount);
//
//     	if (!success) {
//     		await message.channel.send({
//     			embeds: [new MessageEmbed()
//     				.setDescription(`You have less than ${amount} ${this._money.currencySymbol}`)
//     				.withErrorColor(message)],
//     		});
//     		return;
//     	}
//
//     	const result = await playSlots();
//
//     	// Check if all three indexes are the same before we check if there are 2 similar ones
//     	if (result.numbers.every((val, i, arr) => val === arr[0])) {
//     		const winAmount = amount * 30;
//     		await this._money.Add(message.author.id, winAmount);
//     		result.string += `\n\nYou won ${winAmount} ${this._money.currencySymbol}!`;
//     	}
//
//     	// check for two similar indexes
//     	else if (result.numbers[0] === result.numbers[1]
//             || result.numbers[0] === result.numbers[2]
//             || result.numbers[1] === result.numbers[0]
//             || result.numbers[1] === result.numbers[2]
//             || result.numbers[2] === result.numbers[0]
//             || result.numbers[2] === result.numbers[1]) {
//
//     		const winAmount = amount * 10;
//     		await this._money.Add(message.author.id, winAmount);
//     		result.string += `\n\nYou won ${winAmount} ${this._money.currencySymbol}!`;
//     	}
//
//     	else {
//     		result.string += "\n\nYou won nothing\ntry again ^_^";
//     	}
//
//     	await message.channel.send((await playSlots()).string)
//     		.then(async m => {
//     			setTimeout(async () => m.edit((await playSlots()).string), 1000);
//     			setTimeout(async () => m.edit(result.string), 2100);
//     		});
//     }
// }
