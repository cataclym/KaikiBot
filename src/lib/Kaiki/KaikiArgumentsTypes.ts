import { Args, Argument } from "@sapphire/framework";
import { Message } from "discord.js";
import Constants from "../../struct/Constants";

export enum GamblingCommands {
	br,
	betroll = 0,
	bf,
	betflip = 1,
	slot,
	slots = 2,
}

export default class KaikiArgumentsTypes {
    static entries = Object.entries(GamblingCommands) as [
		string,
		GamblingCommands,
	][];

    // These are only for specific use cases, whereas arguments in ../../arguments are more general.
    public static emoteImageArgument = Args.make<string>(
        async (parameter: string, context: Argument.Context<string>) => {
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

            const emoji = await context.args
                .pick("emoji")
                .catch(() => undefined);

            // TODO: TEST IF THIS WORKS FOR ALL EMOTES
            if (emoji) {
                return Args.ok(
                    `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`
                );
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
        }
    );

    public static gamblingCommandsArgument = Args.make<GamblingCommands>(
        async (
            parameter: string,
            context: Argument.Context<GamblingCommands>
        ) => {
            const argument = parameter.toLowerCase();
            const command = KaikiArgumentsTypes.entries.find(
                (entry) => entry[0] === argument
            );
            if (command) {
                return Args.ok(command[1]);
            }
            return Args.error({
                parameter,
                argument: context.argument,
                message:
					"The provided argument could not be resolved to a gambling command.",
            });
        }
    );

    static checkInt = (phrase: string) => {
        const int = parseInt(phrase);

        if (!int) return null;
        if (int < Constants.MAGIC_NUMBERS.LIB.KAIKI.KAIKI_ARGS.MIN_INT)
            return null;
        return int;
    };

    static getCurrency = async (message: Message) =>
        await message.client.money.get(message.author.id);
}
