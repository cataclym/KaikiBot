import { FailureData } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { codeblock } from "../../lib/Util";
import { KaikiCommand } from "kaiki";
import { BotConfig } from "../../struct/db/MySQL";
import Gambling from "../../lib/gambling/gambling";

enum validEnum {
	ACTIVITY = "activity",
	ACTIVITYTYPE = "activityType",
	CURRENCYNAME = "currencyname",
	CURRENCYSYMBOL = "currencysymbol",
	DAILYENABLED = "dailyEnabled",
	DAILYAMOUNT = "dailyAmount"
}
type validTypes = "activity"
	| "activityType"
	|	"currencyname"
	|	"currencysymbol"
	| "dailyEnabled"
	| "dailyAmount";

const validTypes: validTypes[] = [
    "activity",
    "activityType",
    "currencyname",
    "currencysymbol",
    "dailyEnabled",
    "dailyAmount",
];

export default class BotConfigCommand extends KaikiCommand {
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
    }
    public async exec(message: Message, { type, name }: { type: validTypes, name: string}): Promise<Message> {

	    const client = this.client;
	    let oldValue;

	    switch (type) {
            case validEnum.ACTIVITY:
                break;
            case validEnum.ACTIVITYTYPE:
                break;
            case validEnum.CURRENCYNAME:
                oldValue = await client.botSettingsProvider.get("1", "CurrencyName", "Yen");
                await client.botSettingsProvider.set("1", "CurrencyName", name);
                break;
            case validEnum.CURRENCYSYMBOL:
                oldValue = await client.botSettingsProvider.get("1", "CurrencySymbol", "💴");
                await client.botSettingsProvider.set("1", "CurrencySymbol", name);
                break;
            case validEnum.DAILYAMOUNT:
                break;
            case validEnum.DAILYENABLED:
                break;
            default:
                throw new Error("Invalid botconfig provided!");
        }

	    await Gambling.UpdateCurrencyNameAndSymbol(client);

	    return message.channel.send({
	        embeds: [new MessageEmbed()
	            .setTitle("Changed bot configuration")
	            .addField("Old Value", oldValue)
	            .addField("New value", name)
	            .withOkColor(message)],
	    });
    }
}
