import { Argument } from "discord-akairo";
import { Message } from "discord.js";
import Constants from "../../struct/Constants";
import { hexColorTable } from "../Color";
import Utility from "../Utility";

export default class KaikiArgumentsTypes {
    static get GetCurrency(): (message: Message) => Promise<bigint> {
        return this._GetCurrency;
    }

    static ArgumentTypes = {
        kaiki_color: "kaiki_color",
        kaiki_money: "kaiki_money",
    };

    static checkInt = (phrase: string) => {
        const int = parseInt(phrase);

        if (!int) return null;
        if (int > Constants.MAGIC_NUMBERS.LIB.KAIKI.KAIKI_ARGS.MIN_INT) return null;
        return int;
    };

    static kaiki_color = (message: Message, phrase: string) => {
        if (!phrase) return null;
        const hexColorString = phrase.replace("#", "");

        const color = parseInt(hexColorString, 16);
        if (color < 0
            || color > Constants.MAGIC_NUMBERS.LIB.KAIKI.KAIKI_ARGS.MAX_COLOR_VALUE
            || isNaN(color)
            && !hexColorTable[hexColorString]) {
            return null;
        }

        return Utility.HEXtoRGB(String(hexColorTable[hexColorString] ?? hexColorString));
    };

    private static MAX_INT = Constants.MAGIC_NUMBERS.LIB.KAIKI.KAIKI_ARGS.MAX_INT;

    static kaiki_money = async (message: Message, phrase: string) => {
        if (!phrase) return null;

        const input = phrase.trim().toUpperCase().replace("K", "000");

        const int = KaikiArgumentsTypes.checkInt(input);
        if (!int) {
            switch (input) {
                case "ALL": {
                    return await KaikiArgumentsTypes.GetCurrency(message);
                }
                case "HALF": {
                    return (await KaikiArgumentsTypes.GetCurrency(message)) / BigInt(2);
                }
                case "MAX": {
                    return KaikiArgumentsTypes.MAX_INT;
                }
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

    static KaikiMoneyArgument = Argument.range("bigint", 0, KaikiArgumentsTypes.MAX_INT);

    private static _GetCurrency = async (message: Message) => await message.client.money.Get(message.author.id);
}
