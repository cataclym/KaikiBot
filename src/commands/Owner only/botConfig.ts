import { FailureData } from "discord-akairo";
import { ActivityType, EmbedBuilder, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";
import { BotConfig } from "../../struct/db/Database";
import SetActivityCommand from "./setActivity";

enum ValidEnum {
    ACTIVITY = "activity",
    ACTIVITYTYPE = "activityType",
    CURRENCYNAME = "currencyname",
    CURRENCYSYMBOL = "currencysymbol",
    DAILYENABLED = "dailyEnabled",
    DAILYAMOUNT = "dailyAmount"
}

type ValidTypes = "activity"
    | "activityType"
    | "currencyname"
    | "currencysymbol"
    | "dailyEnabled"
    | "dailyAmount";

export default class BotConfigCommand extends KaikiCommand {
    private static _validTypes: ValidTypes[] = [
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
                            return ({
                                embeds: [
                                    new EmbedBuilder()
                                        .setDescription(`\`${_.phrase}\` is not a valid setting`)
                                        .addFields([
                                            {
                                                name: "Valid settings",
                                                value: BotConfigCommand._validTypes.join("\n"),
                                            },
                                        ])
                                        .withErrorColor(msg),
                                ],
                            });
                        }
                        else {
                            return {
                                embeds: [
                                    new EmbedBuilder()
                                        .addFields([
                                            {
                                                name: "Bot config",
                                                value: await Utility.codeblock(JSON
                                                    .stringify(new BotConfig(await this.client.connection().query("SELECT * FROM BotSettings")), null, 4), "xl"),
                                            },
                                        ])
                                        .withOkColor(msg),
                                ],
                            };
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

    public async exec(message: Message, { type, value }: { type: ValidTypes, value: string }): Promise<Message> {

        const client = this.client;
        let oldValue;

        switch (type) {
            case ValidEnum.ACTIVITY:
                oldValue = await this.client.botSettings.get("1", "Activity", "N/A");
                await this.handler.findCommand("setactivity")
                    .exec(message, {
                        type: await this.client.botSettings.get("1", "ActivityType", "PLAYING"),
                        name: value,
                    });
                break;
            case ValidEnum.ACTIVITYTYPE:
                value = value.toUpperCase();
                if (SetActivityCommand.validTypes.includes(value)) {
                    oldValue = await this.client.botSettings.get("1", "ActivityType", SetActivityCommand.validTypes[ActivityType.Playing]);
                    await this.handler.findCommand("setactivity")
                        .exec(message, {
                            name: await this.client.botSettings.get("1", "Activity", "N/A"),
                            type: value,
                        });
                }
                break;
            case ValidEnum.CURRENCYNAME:
                oldValue = await client.botSettings.get("1", "CurrencyName", "Yen");
                await client.botSettings.set("1", "CurrencyName", String(value));
                client.money.currencyName = value;
                break;
            case ValidEnum.CURRENCYSYMBOL:
                oldValue = await client.botSettings.get("1", "CurrencySymbol", Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.BOT_CONFIG.DEFAULT_CUR_CODE);
                await client.botSettings.set("1", "CurrencySymbol", value.codePointAt(0));
                client.money.currencySymbol = value;
                break;
            case ValidEnum.DAILYAMOUNT:
                oldValue = await client.botSettings.get("1", "DailyAmount", Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.BOT_CONFIG.DAILY_AMOUNT);
                await client.botSettings.set("1", "DailyAmount", value);
                break;
            case ValidEnum.DAILYENABLED:
                oldValue = await client.botSettings.get("1", "DailyEnabled", false);
                await client.botSettings.set("1", "DailyEnabled", value);
                break;
            default:
                throw new Error("Invalid bot-configuration provided!");
        }

        if (oldValue == null || value == null) {
            return message.channel.send({
                embeds: [await KaikiEmbeds.errorMessage(message, "An invalid configuration was provided.")],
            });
        }

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Changed bot configuration")
                    .addFields([
                        {
                            name: "Old Value",
                            value: oldValue,
                        },
                        {
                            name: "New value",
                            value: value,
                        },
                    ])
                    .withOkColor(message),
            ],
        });
    }
}
