import { ApplyOptions } from "@sapphire/decorators";
import { Args, MessageCommand, MessageCommandContext } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiSubCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiSubCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";
import { BotConfig } from "../../struct/db/Database";
import SetActivityCommand, { ValidActivities } from "./setActivity";

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
            name: "activity",
            messageRun: "activityRun",
        },
        {
            name: "activityType",
            messageRun: "activityTypeRun",
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
export default class BotConfigCommand extends KaikiCommand {

    public async messageRun(message: Message, args: Args, context: MessageCommand.RunContext) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .addFields([
                        {
                            name: "Bot config",
                            value: await Utility.codeblock(JSON
                                .stringify(new BotConfig(await this.client.connection().query("SELECT * FROM BotSettings")), null, 4), "json"),
                        },
                    ])
                    .withOkColor(message),
            ],
        });
    }


    // TODO: Remember to test this out / Fix moving args over from subcommand / Calling the command correctly.
    public async activityRun(message: Message, args: Args, context: MessageCommandContext) {
        return this.setActivityCommand().messageRun?.call(this, message, args, context);
    }

    public async activityTypeRun(message: Message, args: Args, context: MessageCommandContext) {
        return this.setActivityCommand().messageRun?.call(this, message, args, context);
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
        const value = (await args.rest("string"))[0];

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

    private static activityTypeArgument = Args.make<ValidActivities>((parameter, context) => {

        const str = parameter.toUpperCase();

        if (BotConfigCommand.assertType(str)) {
            return Args.ok(str);
        }

        return Args.error({
            argument: context.argument,
            parameter,
            message: `The provided argument doesn't match a valid activity type.
Valid types are: \`${SetActivityCommand.validActivities.join("`, `")}\``,
        });
    });

    private static assertType = ((str: string): str is ValidActivities => {
        return SetActivityCommand.validActivities.includes(str as ValidActivities);
    });

    private setActivityCommand = () => {
        const cmd = this.store.get("setactivity");
        if (cmd) return cmd;
        // TODO: Make this safer
        throw new Error();
    };

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
