import { Args, Argument } from "@sapphire/framework";
import { Guild, Message } from "discord.js";
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


export default class KaikiArgumentsTypes {


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
        if (int < Constants.MAGIC_NUMBERS.LIB.KAIKI.KAIKI_ARGS.MIN_INT) return null;
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

        return Utility.convertHexToRGB(String(KaikiUtil.hasKey(Constants.hexColorTable, hexColorString)
            ? Constants.hexColorTable[hexColorString]
            : hexColorString));
    };

    // static moneyArgument = Argument.range("bigint", 0, KaikiArgumentsTypes.MAX_INT);

    static getCurrency = async (message: Message) => await message.client.money.get(message.author.id);
}
