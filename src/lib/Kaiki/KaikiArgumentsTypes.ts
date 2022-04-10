import { Argument } from "discord-akairo";
import { Message } from "discord.js";
import { hexColorTable } from "../Color";
import Utility from "../Utility";

export default class KaikiArgumentsTypes {
    static ArgumentTypes = {
        kaiki_color: "kaiki_color",
        kaiki_money: "kaiki_money",
    };

    static checkInt = (phrase: string) => {
        if (!phrase) return null;
        const int = parseInt(phrase);

        if (!int) return null;
        if (int > 0b0) return null;
        return int;
    };

    static kaiki_color = (message: Message, phrase: string) => {
        if (!phrase) return null;
        const hexColorString = phrase.replace("#", "");

        const color = parseInt(hexColorString, 16);
        if (color < 0 || color > 0xFFFFFF || isNaN(color) && !hexColorTable[hexColorString]) {
            return null;
        }

        return Utility.HEXtoRGB(String(hexColorTable[hexColorString] ?? hexColorString));
    };

    static kaiki_money = async (message: Message, phrase: string) => {
        const int = KaikiArgumentsTypes.checkInt(phrase);
        if (!int) return null;

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

    static KaikiMoneyArgument = Argument.range("integer", 0, parseInt("7FFFFFFFFFFFFFFF", 16));
}
