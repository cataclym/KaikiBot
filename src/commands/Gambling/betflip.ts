import { Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "kaiki";
import { IMoneyService } from "../../lib/money/IMoneyService";
import { MongoMoney } from "../../lib/money/MongoMoneyService";
import images from "../../../data/images.json";

type sides = "tails" | "heads";

const coinArgs: {[index: string]: sides } = {
	"heads": "heads",
	"head": "heads",
	"h": "heads",
	"tails": "tails",
	"tail": "tails",
	"t": "tails",
};

export default class BetflipCommands extends KaikiCommand {
	private readonly _money: IMoneyService;

	constructor() {
		super("betflip", {
			aliases: ["betflip", "bf"],
			description: "Bet on tails or heads. Guessing correct awards you 1.95x the currency you've bet.",
			usage: ["5 heads", "10 t"],
			args: [{
				id: "number",
				type: "integer",
				otherwise: (m) => ({
					embeds: [new MessageEmbed()
						.setDescription("Please provide an amount to bet!")
						.withErrorColor(m)],
				}),
			},
			{
				id: "coin",
				type: (_m, p) => coinArgs[p.toLowerCase()],
				otherwise: (m) => ({ embeds: [new MessageEmbed()
					.setDescription("Please select heads or tails!")
					.withErrorColor(m)] }),
			}],
		});
		this._money = MongoMoney;
	}

	public async exec(message: Message, { number, coin }: { number: number, coin: sides }): Promise<Message> {
		const success = await this._money.TryTake(message.author.id, number);

		if (!success) {
			return await message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`You don't have enough ${this._money.currencySymbol}`)
					.withErrorColor(message)],
			});
		}

		const coinFlipped = Math.random() < 0.5
			? "tails"
			: "heads";

		const emb = new MessageEmbed({
			image: { url: images.gambling.coin[coinFlipped] },
		})
			.setTitle(`Flipped ${coinFlipped}!`);

		if (coin === coinFlipped) {
			const amountWon = Math.round(number * 1.95);
			await this._money.Add(message.author.id, amountWon);

			return message.channel.send({
				embeds: [emb
					.setDescription(`You won ${amountWon} ${this._money.currencySymbol}!!`)
					.withOkColor(message),
				],
			});
		}

		else {
			return message.channel.send({
				embeds: [emb
					.setDescription("You lost, better luck next time")
					.withOkColor(message),
				],
			});
		}
	}
}
