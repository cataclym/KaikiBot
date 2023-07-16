import { Args, Argument } from "@sapphire/framework";
import { Guild, Message } from "discord.js";
import Constants from "../../struct/Constants";
import { JSONToMessageOptions } from "../GreetHandler";
import Utility from "../Utility";
import KaikiUtil from "./KaikiUtil";


export default class KaikiArgumentsTypes {

    // These are only for specific use cases, whereas arguments in ../../arguments are more general.
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

    public static emoteImageArgument = Args.make<string>( async (parameter: string, context: Argument.Context<string>) => {

        if (!parameter) {
            return Args.error({
                parameter,
                argument: context.argument,
            });
        }

        if (context.message.attachments.size) {
            const attachment = context.message.attachments.first();

            if (attachment) {
                return Args.ok(attachment.url);
            }

            return Args.error({
                parameter,
                argument: context.argument,
            });
        }

        const emoji = await context.args.pick("emoji").catch(() => undefined);

        // TODO: TEST IF THIS WORKS FOR ALL EMOTES
        if (emoji) {
            return Args.ok(`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`);
        }

        const url = await context.args.pick("url").catch(() => undefined);

        // TODO: TEST IF THIS WORKS AT ALL
        if (url) {
            return Args.ok(url.href);
        }

        return Args.error({
            parameter,
            argument: context.argument,
        });
    });

    static checkInt = (phrase: string) => {
        const int = parseInt(phrase);

        if (!int) return null;
        if (int < Constants.MAGIC_NUMBERS.LIB.KAIKI.KAIKI_ARGS.MIN_INT) return null;
        return int;
    };

    static getCurrency = async (message: Message) => await message.client.money.get(message.author.id);
}
