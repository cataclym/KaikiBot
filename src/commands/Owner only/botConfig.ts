import { FailureData } from "discord-akairo";
import { ExcludeEnum, Message, MessageEmbed } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";
import { BotConfig } from "../../struct/db/Database";
import SetActivityCommand from "./setActivity";
import { ActivityTypes } from "discord.js/typings/enums";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";

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

export default class BotConfigCommand extends KaikiCommand {
    private static _validTypes: validTypes[] = [
        "activity",
        "activityType",
        "currencyname",
        "currencysymbol",
        "dailyEnabled",
        "dailyAmount",
    ];
    constructor() {
	    super("botconfig", {
	        aliases: ["botconfig", "bc"],
	        description: "Change various bot configurations. Run without arguments to see current settings.",
	        usage: ["<setting> <value>", "currencyname Europe Dollars"],
	        ownerOnly: true,
	        args: [
	            {
	                id: "type",
	                type: BotConfigCommand._validTypes,
	                otherwise: async (msg: Message, _: FailureData) => {
	                    if (_.phrase.length) {
	                        return ({ embeds: [new MessageEmbed()
	                            .setDescription(`\`${_.phrase}\` is not a valid setting`)
	                            .addField("Valid settings", BotConfigCommand._validTypes.join("\n"))
	                            .withErrorColor(msg)],
	                        });
	                    }
	                    else {
	                        return ({ embeds: [new MessageEmbed()
	                            .addField("Bot config", await Utility.codeblock(JSON
	                                .stringify(new BotConfig(await this.client.connection.query("SELECT * FROM BotSettings")), null, 4), "xl"))
	                            .withOkColor(msg)],
	                        });
	                    }
	                },
	            },
	            {
	                id: "value",
	                type: "string",
	                match: "restContent",
	                otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
	            },
	        ],
	    });
    }
    public async exec(message: Message, { type, value }: { type: validTypes, value: string}): Promise<Message> {

	    const client = this.client;
	    let oldValue;

        switch (type) {
            case validEnum.ACTIVITY:
                oldValue = await this.client.botSettingsProvider.get("1", "Activity", "N/A");
                await this.handler.findCommand("setactivity")
                    .exec(message, {
                        type: await this.client.botSettingsProvider.get("1", "ActivityType", ActivityTypes.PLAYING),
                        name: value,
                    });
                break;
            case validEnum.ACTIVITYTYPE:
                oldValue = await this.client.botSettingsProvider.get("1", "ActivityType", ActivityTypes.PLAYING);
                await this.handler.findCommand("setactivity")
                    .exec(message, {
                        type: value,
                        name: await this.client.botSettingsProvider.get("1", "Activity", "N/A"),
                    });
                break;
            case validEnum.CURRENCYNAME:
                oldValue = await client.botSettingsProvider.get("1", "CurrencyName", "Yen");
                await client.botSettingsProvider.set("1", "CurrencyName", String(value));
                client.money.currencyName = value;
                break;
            case validEnum.CURRENCYSYMBOL:
                oldValue = await client.botSettingsProvider.get("1", "CurrencySymbol", 128180);
                await client.botSettingsProvider.set("1", "CurrencySymbol", value.codePointAt(0));
                client.money.currencySymbol = value;
                break;
            case validEnum.DAILYAMOUNT:
                oldValue = await client.botSettingsProvider.get("1", "DailyAmount", 250);
                await client.botSettingsProvider.set("1", "DailyAmount", value);
                break;
            case validEnum.DAILYENABLED:
                oldValue = await client.botSettingsProvider.get("1", "DailyEnabled", false);
                await client.botSettingsProvider.set("1", "DailyEnabled", value);
                break;
            default:
                throw new Error("Invalid bot-configuration provided!");
        }

	    return message.channel.send({
	        embeds: [new MessageEmbed()
	            .setTitle("Changed bot configuration")
	            .addField("Old Value", oldValue)
	            .addField("New value", value)
	            .withOkColor(message)],
	    });
    }
}
