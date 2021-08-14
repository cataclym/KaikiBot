import { Message, MessageAttachment, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { KaikiCommand } from "kaiki";
import { IMoneyService } from "../../lib/money/IMoneyService";
import { MongoMoney } from "../../lib/money/MongoMoneyService";
import { customClient } from "../../struct/client";
import { Argument } from "discord-akairo";
import { getBotDocument } from "../../struct/documentMethods";


export default class SetDailyCommand extends KaikiCommand {
	private readonly _money: IMoneyService;
	constructor() {
		super("setdaily", {
			aliases: ["setdaily", "dailyset"],
			description: "Sets the daily currency allowance amount for users. Set to 0 to disable.",
			usage: "",
			ownerOnly: true,
			args: [
				{
					id: "arg",
					type: "integer",
					otherwise: (msg: Message) => ({ embeds: [noArgGeneric(msg)] }),
				},
			],
		});
		this._money = MongoMoney;
	}

	public async exec(message: Message, { arg }: { arg: number }): Promise<Message> {

		const db = await getBotDocument();
		const isEnabled = db.settings.dailyEnabled;

		if (arg > 0) {
			db.settings.dailyAmount = arg;

			if (!isEnabled) {
				db.settings.dailyEnabled = true;
			}

			db.markModified("settings");
			await db.save();

			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`Users will be able to claim ${arg} ${this._money.currencyName} ${this._money.currencySymbol} every day`)
					.withOkColor(message),
				],
			});
		}

		else if (!isEnabled) {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription("Daily currency allowance is already disabled!")
					.withErrorColor(message),
				],
			});
		}

		else {

			db.settings.dailyEnabled = false;

			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription("Disabled daily currency allowance.")
					.withOkColor(message),
				],
			});
		}
	}
}
