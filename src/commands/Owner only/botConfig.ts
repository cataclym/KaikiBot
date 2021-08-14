import { FailureData } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { codeblock } from "../../lib/Util";
import { customClient } from "../../struct/client";
import { IMoneyService } from "../../lib/money/IMoneyService";
import { MongoMoney } from "../../lib/money/MongoMoneyService";
import { KaikiCommand } from "kaiki";


const validTypes = ["currencyname", "currencysymbol"];

export default class BotConfigCommand extends KaikiCommand {
	private readonly _money: IMoneyService;

	constructor() {
		super("botconfig", {
			aliases: ["botconfig", "bc"],
			description: "Change various bot configurations. Run without arguments to see current settings.",
			usage: ["<setting> <value>", "currencyname Europe Dollars"],
			ownerOnly: true,
			args: [
				{
					id: "type",
					type: validTypes,
					otherwise: async (msg: Message, _: FailureData) => {
						if (_.phrase.length) {
							return ({ embeds: [new MessageEmbed()
								.setDescription(`\`${_.phrase}\` is not a valid setting`)
								.addField("Valid settings", validTypes.join("\n"))
								.withErrorColor(msg)] });
						}
						else {
							return ({ embeds: [new MessageEmbed()
								.addField("Bot config", await codeblock(JSON
									.stringify((await msg.client.botSettings
										.getDocument(msg.client.botSettingID)).settings, null, 4), "xl"))
								.withOkColor(msg)] });
						}
					},
				},
				{
					id: "name",
					type: "string",
					match: "restContent",
					otherwise: (m: Message) => ({ embeds: [noArgGeneric(m)] }),
				},
			],
		});

		this._money = MongoMoney;
	}
	public async exec(message: Message, { type, name }: { type: string, name: string}): Promise<Message> {

		const client = this.client as customClient;
		let oldValue;

		switch (type.toLowerCase()) {
			case validTypes[0]:
				oldValue = await client.botSettings.get(client.botSettingID, "currencyName", "Yen");
				await client.botSettings.set(client.botSettingID, "currencyName", name);
				break;
			case validTypes[1]:
				oldValue = await client.botSettings.get(client.botSettingID, "currencyName", "💴");
				await client.botSettings.set(client.botSettingID, "currencySymbol", name);
				break;
		}

		await this._money.UpdateCurrencyNameAndSymbol(this.client as customClient);

		return message.channel.send({
			embeds: [new MessageEmbed()
				.setTitle("Changed bot configuration")
				.addField("Old Value", oldValue)
				.addField("New value", name)
				.withOkColor(message)],
		});
	}
}
