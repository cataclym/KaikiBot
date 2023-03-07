import { Args, container } from "@sapphire/framework";
import { Message } from "discord.js";
import Constants from "../../struct/Constants";
import { hexColorTable } from "../Color";
import Utility from "../Utility";
import KaikiCommand from "./KaikiCommand";
import KaikiUtil from "./KaikiUtil";

export default class KaikiArgumentsTypes {

    public static commandIArgument = Args.make<KaikiCommand>(async (parameter, context) => {
        const result = container.stores.get("commands")
            .find(k => {
                const name = k.name.toLowerCase();

                return parameter
                    .toLowerCase()
                    .startsWith(name.slice(0, Math.max(parameter.length - 1, 1)));
            });

        if (!result) {
            return Args.error({
                argument: context.argument,
                parameter,
                context,
            });
        }
        return Args.ok(result as KaikiCommand);
    });

    public static categoryIArgument = Args.make<string>(async (parameter, context) => {
        const result = container.stores.get("commands")
            .categories.find(k => {

                k = k.toLowerCase();

                return parameter
                    .toLowerCase()
                    .startsWith(k.slice(0, Math.max(parameter.length - 1, 1)));
            });

        if (!result) {
            return Args.error({
                argument: context.argument,
                parameter,
                context,
            });
        }

        return Args.ok(result);
    });

    public static urlEmoteAttachmentIArgument = Args.make<string>(async (parameter, context) => {

        if (context.message.attachments.size) {
            const url = context.message.attachments.first()?.url;
            if (url) return Args.ok(url);
        }

        const imageMatches = parameter.match(Constants.imageRegex);

        if (imageMatches) {
            return Args.ok(imageMatches[0].toString());
        }

        const emoteMatches = parameter.match(Constants.emoteRegex);

        if (emoteMatches) {
            const urlMatch = emoteMatches[0].toString();

            if (urlMatch.startsWith("<") && urlMatch.endsWith(">")) {

                const emoteID = urlMatch.match(/\d+/g);

                const type = urlMatch.indexOf("a") === 1 ? "gif" : "png";

                if (emoteID) {
                    // Construct emote url - If it has '<a:...'  at the beginning, then it's a gif format.
                    const emoteUrl = `https://cdn.discordapp.com/emojis/${emoteID.toString()}.${type}`;

                    return Args.ok(emoteUrl);
                }

                // Get emote name from emote construction <:name:snowflake>
                // name = name ?? urlMatch.slice(2, urlMatch.lastIndexOf(":")).replace(":", "");
            }
        }
        return Args.error({
            context,
            argument: context.argument,
            parameter,
        });
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
