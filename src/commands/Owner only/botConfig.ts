import { FailureData } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { codeblock } from "../../lib/Util";
import { MongoMoney, MongoMoneyService } from "../../lib/money/MongoMoneyService";
import { KaikiCommand } from "kaiki";
import { BotConfig } from "../../struct/db/MySQL";

const validTypes = ["currencyname", "currencysymbol"];

export default class BotConfigCommand extends KaikiCommand {
    private readonly _money: MongoMoneyService;

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
	                            .withErrorColor(msg)],
	                        });
	                    }
	                    else {
	                        return ({ embeds: [new MessageEmbed()
	                            .addField("Bot config", await codeblock(JSON
	                                .stringify(new BotConfig(await this.client.connection.query("SELECT * FROM BotSettings")), null, 4), "xl"))
	                            .withOkColor(msg)],
	                        });
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

	    const client = this.client;
	    let oldValue;

	    switch (type.toLowerCase()) {
	        case validTypes[0]:
	            oldValue = await client.botSettings.get(client.botSettingID, "currencyName", "Yen");
	            await client.botSettings.set(client.botSettingID, "currencyName", name);
	            break;
	        case validTypes[1]:
	            oldValue = await client.botSettings.get(client.botSettingID, "currencySymbol", "💴");
	            await client.botSettings.set(client.botSettingID, "currencySymbol", name);
	            break;
	    }

	    await this._money.UpdateCurrencyNameAndSymbol(client);

	    return message.channel.send({
	        embeds: [new MessageEmbed()
	            .setTitle("Changed bot configuration")
	            .addField("Old Value", oldValue)
	            .addField("New value", name)
	            .withOkColor(message)],
	    });
    }
}
