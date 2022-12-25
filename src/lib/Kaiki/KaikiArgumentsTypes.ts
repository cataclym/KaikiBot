import { Argument } from "discord-akairo";
import { Message } from "discord.js";
import Constants from "../../struct/Constants";
import { hexColorTable } from "../Color";
import Utility from "../Utility";

export default class KaikiArgumentsTypes {

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
            && !hexColorTable[hexColorString]) {
            return null;
        }

        return Utility.HEXtoRGB(String(hexColorTable[hexColorString] ?? hexColorString));
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

    static moneyArgument = Argument.range("bigint", 0, KaikiArgumentsTypes.MAX_INT);

    private static getCurrency = async (message: Message) => await message.client.money.Get(message.author.id);
}
