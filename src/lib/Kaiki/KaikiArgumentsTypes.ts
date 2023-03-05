import { Args, Argument, ArgumentContext, container } from "@sapphire/framework";
import { Message } from "discord.js";
import Constants from "../../struct/Constants";
import { hexColorTable } from "../Color";
import Utility from "../Utility";
import KaikiCommand from "./KaikiCommand";
import KaikiUtil from "./KaikiUtil";

type CommandArgumentContext = ArgumentContext<KaikiCommand>

export class CommandArgument extends Argument<KaikiCommand> {
    public async run(parameter: string, context: CommandArgumentContext) {
        const commands = container.stores.get("commands");
        const command = commands.get(parameter.toLowerCase());

        if (!command) {
            return this.error({
                parameter,
                context,
            });
        }
        return this.ok(command as KaikiCommand);
    }
}

export default class KaikiArgumentsTypes {

    public static CommandArg = Args.make<KaikiCommand>((parameter, context) => {
        const commands = container.stores.get("commands");
        const command = commands.get(parameter.toLowerCase());

        if (!command) {
            return Args.error({
                argument: context.argument,
                parameter,
                context,
            });
        }
        return Args.ok(command as KaikiCommand);
    });


    static argumentTypes = {
        kaiki_color: "kaiki_color",
        kaiki_money: "kaiki_money",
    };

    static checkInt = (phrase: string) => {
        const int = parseInt(phrase);

        if (!int) return null;
        if (int > Constants.MAGIC_NUMBERS.LIB.KAIKI.KAIKI_ARGS.MIN_INT) return null;
        return int;
    };

    static kaikiColorArgument = (message: Message, phrase: string) => {
        if (!phrase) return null;
        const hexColorString = phrase.replace("#", "");

        const color = parseInt(hexColorString, 16);
        if (color < 0
            || color > Constants.MAGIC_NUMBERS.LIB.KAIKI.KAIKI_ARGS.MAX_COLOR_VALUE
            || isNaN(color)
            && !KaikiUtil.hasKey(hexColorTable, hexColorString)) {
            return null;
        }

        return Utility.HEXtoRGB(String(KaikiUtil.hasKey(hexColorTable, hexColorString)
            ? hexColorTable[hexColorString]
            : hexColorString));
    };

    private static MAX_INT = Constants.MAGIC_NUMBERS.LIB.KAIKI.KAIKI_ARGS.MAX_INT;

    static kaikiMoneyArgument = async (message: Message, phrase: string) => {
        if (!phrase) return null;

        const input = phrase.trim().toUpperCase().replace("K", "000");

        const int = KaikiArgumentsTypes.checkInt(input);
        if (!int) {
            switch (input) {
                case "ALL":
                    return await KaikiArgumentsTypes.getCurrency(message);

                case "HALF":
                    return (await KaikiArgumentsTypes.getCurrency(message)) / BigInt(2);

                case "MAX":
                    return KaikiArgumentsTypes.MAX_INT;

            }
            return null;
        }

        return message.client.money.Get(message.author.id)
            .then(money => {
                if (int <= money) {
                    return int;
                }
                else {
                    return false;
                }
            });
    };

    // static moneyArgument = Argument.range("bigint", 0, KaikiArgumentsTypes.MAX_INT);

    private static getCurrency = async (message: Message) => await message.client.money.Get(message.author.id);
}
