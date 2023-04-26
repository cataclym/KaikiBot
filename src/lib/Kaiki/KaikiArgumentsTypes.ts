import { Args, Argument } from "@sapphire/framework";
import { Guild, Message } from "discord.js";
import SetActivityCommand, { ValidActivities } from "../../commands/Owner only/setActivity";
import Constants from "../../struct/Constants";
import { JSONToMessageOptions } from "../GreetHandler";
import Utility from "../Utility";
import KaikiUtil from "./KaikiUtil";

export class GuildArgument extends Argument<Guild> {
    public async run(parameter: string, context: Argument.Context<Guild>) {
        const guild = context.message.client.guilds.cache.find(g => g.name.toLowerCase() === parameter.toLowerCase() || g.id === parameter);

        if (guild) return this.ok(guild);

        return this.error({ parameter });
    }
}

export class WelcomeGoodbyeMessageArgument extends Argument<JSONToMessageOptions> {
    public async run(parameter: string, context: Argument.Context<JSONToMessageOptions>) {
        try {
            const json = JSON.parse(parameter);

            const messageOptions = new JSONToMessageOptions(json);

            if (messageOptions) return this.ok(messageOptions);
            return this.error({ parameter });
        }
        catch {
            return this.error({ parameter });
        }
    }
}

export class EmoteImageArgument extends Argument<string> {
    public async run(parameter: string, context: Argument.Context<string>) {

        if (!parameter) {
            return this.error({
                parameter,
            });
        }

        if (context.message.attachments.size) {
            const attachment = context.message.attachments.first();

            if (attachment) {
                return this.ok(attachment.url);
            }

            return this.error({
                parameter,
            });
        }

        const emoji = await context.args.pick("emoji").catch(() => undefined);

        // TODO: TEST IF THIS WORKS FOR ALL EMOTES
        if (emoji) {
            return this.ok(`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`);
        }

        const url = await context.args.pick("url").catch(() => undefined);

        // TODO: TEST IF THIS WORKS AT ALL
        if (url) {
            return this.ok(url.href);
        }

        return this.error({
            parameter,
        });
    }
}


export class KaikiMoneyArgument extends Argument<bigint> {
    public async run(parameter: string, context: Argument.Context<bigint>) {
        if (!parameter) return this.error({ context, parameter: parameter });

        const input = parameter.trim().toUpperCase().replace("K", "000");

        const int = KaikiArgumentsTypes.checkInt(input);

        if (!int) {
            switch (input) {
                case "ALL":
                    return this.ok(await KaikiArgumentsTypes.getCurrency(context.message));

                case "HALF":
                    return this.ok(await KaikiArgumentsTypes.getCurrency(context.message) / BigInt(2));

                case "MAX":
                    return this.ok(BigInt(Constants.MAGIC_NUMBERS.LIB.KAIKI.KAIKI_ARGS.MAX_INT));

            }
            return this.error({ context, parameter });
        }

        return context.message.client.money.Get(context.message.author.id)
            .then(money => {
                if (int <= money) {
                    return this.ok(BigInt(int));
                }
                else {
                    return this.error({ context, parameter });
                }
            });
    }
}

export class KaikiCoinFlipArgument extends Argument<string> {

    static coinArgs: { [i: string]: string } = {
        "heads": "heads",
        "head": "heads",
        "h": "heads",
        "tails": "tails",
        "tail": "tails",
        "t": "tails",
    };

    public run(parameter: string, context: Argument.Context<string>): Argument.AwaitableResult<string> {

        if (Object.keys(KaikiCoinFlipArgument.coinArgs).includes(parameter)) {
            return this.ok(KaikiCoinFlipArgument.coinArgs[parameter]);
        }
        return this.error({ parameter, message: "The provided argument could not be resolved to a coin side." });
    }
}

export class KaikiHentaiTypesArgument extends Argument<string> {
    private static hentaiArray = ["waifu", "neko", "femboy", "blowjob"];

    public run(parameter: string) {
        return KaikiHentaiTypesArgument.hentaiArray.includes(parameter)
            ? this.ok(parameter)
            : this.error({ parameter, message: "The provided argument could not be resolved to a hentai category." });
    }
}

export default class KaikiArgumentsTypes {

    public static activityTypeArgument = Args.make<ValidActivities>((parameter, context) => {

        const str = parameter.toUpperCase();

        if (KaikiArgumentsTypes.assertType(str)) {
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
            && !KaikiUtil.hasKey(Constants.hexColorTable, hexColorString)) {
            return null;
        }

        return Utility.HEXtoRGB(String(KaikiUtil.hasKey(Constants.hexColorTable, hexColorString)
            ? Constants.hexColorTable[hexColorString]
            : hexColorString));
    };

    // static moneyArgument = Argument.range("bigint", 0, KaikiArgumentsTypes.MAX_INT);

    static getCurrency = async (message: Message) => await message.client.money.Get(message.author.id);
}
