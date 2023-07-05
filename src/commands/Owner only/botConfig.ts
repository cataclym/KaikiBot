import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { container } from "@sapphire/pieces";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiSubCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiSubCommandOptions";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";
import { BotConfig } from "../../struct/db/Database";

enum ValidEnum {
    ACTIVITY = "activity",
    ACTIVITYTYPE = "activityType",
    CURRENCYNAME = "currencyname",
    CURRENCYSYMBOL = "currencysymbol",
    DAILYENABLED = "dailyEnabled",
    DAILYAMOUNT = "dailyAmount"
}

type ValidTypes = ["activity", "activityType", "currencyname", "currencysymbol", "dailyEnabled", "dailyAmount"];

@ApplyOptions<KaikiSubCommandOptions>({
    name: "botconfig",
    aliases: ["bc"],
    description: "Change various bot configurations. Run without arguments to see current settings.",
    usage: ["<setting> <value>", "currencyname Europe Dollars"],
    preconditions: ["OwnerOnly"],
    subcommands: [
        {
            name: "show",
            messageRun: "showRun",
            default: true,
        },
        {
            name: "activity",
            messageRun: "activityRun",
        },
        {
            name: "activitytype",
            messageRun: "activitytypeRun",
        },
        {
            name: "currencyname",
            messageRun: "currencynameRun",
        },
        {
            name: "currencysymbol",
            messageRun: "currencysymbolRun",
        },
        {
            name: "dailyEnabled",
            messageRun: "dailyEnabledRun",
        },
        {
            name: "dailyAmount",
            messageRun: "dailyAmountRun",
        },
    ],
})
export default class BotConfigCommand extends Subcommand {

    private client = container.client;

    public async showRun(message: Message) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .addFields([
                        {
                            name: "Bot config",
                            value: await Utility.codeblock(JSON
                                .stringify(new BotConfig(await this.client.connection.query("SELECT * FROM BotSettings")), null, 4), "json"),
                        },
                    ])
                    .withOkColor(message),
            ],
        });
    }

    // TODO: Remember to test this out / Fix moving args over from subcommand / Calling the command correctly.
    public async activityRun(message: Message, args: Args) {
        const name = await args.rest("string");
        const oldActivity = this.client.botSettings.get("1", "Activity", null);

        message.client.user.setActivity({ name: name });
        this.client.botSettings.set("1", "Activity", name);

        return BotConfigCommand.sendEmbed(message, oldActivity, name);
    }

    public async activitytypeRun(message: Message, args: Args) {
        const type = await args.pick("activityType");
        const activity = this.client.botSettings.get("1", "Activity", null);
        const oldActivityType = this.client.botSettings.get("1", "ActivityType", null);

        if (activity) {
            message.client.user.setActivity({ type: Constants.activityTypes[type] });
        }

        this.client.botSettings.set("1", "ActivityType", type);

        return BotConfigCommand.sendEmbed(message, oldActivityType, type);
    }

    public async currencynameRun(message: Message, args: Args) {
        const value = await args.rest("string");

        const oldValue = <string> await this.client.botSettings.get("1", "CurrencyName", "Yen");
        await this.client.botSettings.set("1", "CurrencyName", value);
        this.client.money.currencyName = value;

        return BotConfigCommand.sendEmbed(message, oldValue, value);
    }

    public async currencysymbolRun(message: Message, args: Args) {
        // Grab only the first letter
        const value = await args.rest("string");

        const oldValue = <string> await this.client.botSettings.get("1", "CurrencySymbol", Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.BOT_CONFIG.DEFAULT_CUR_CODE);
        await this.client.botSettings.set("1", "CurrencySymbol", value.codePointAt(0));
        this.client.money.currencySymbol = value;

        return BotConfigCommand.sendEmbed(message, oldValue, value);
    }

    public async dailyEnabledRun(message: Message, args: Args) {
        const value = await args.rest(BotConfigCommand.booleanArgument);

        const oldValue = <boolean> await this.client.botSettings.get("1", "DailyEnabled", false);
        await this.client.botSettings.set("1", "DailyEnabled", value);

        return BotConfigCommand.sendEmbed(message, String(oldValue), String(value));
    }

    public async dailyAmountRun(message: Message, args: Args) {
        const value = await args.rest("number");

        const oldValue = <number> await this.client.botSettings.get("1", "DailyAmount", Constants.MAGIC_NUMBERS.CMDS.OWNER_ONLY.BOT_CONFIG.DAILY_AMOUNT);
        await this.client.botSettings.set("1", "DailyAmount", value);

        return BotConfigCommand.sendEmbed(message, String(oldValue), String(value));
    }

    private static booleanArgument = Args.make<boolean>((parameter, context) => {
        const value = parameter.toLowerCase();

        switch (value) {
            case "false" :
            case "disable" :
            case "0" :
                return Args.ok(false);

            case "true" :
            case "enable" :
            case "1" :
                return Args.ok(true);

            default:
                return Args.error({
                    argument: context.argument,
                    parameter,
                    message: "Value must be of: true, false, enable, disable, 0, 1",
                });
        }
    });

    private static sendEmbed = (message: Message, oldValue: string, newValue: string) => {
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
                            value: newValue,
                        },
                    ])
                    .withOkColor(message),
            ],
        });
    };
}
