import { Argument } from "discord-akairo";
import { ChannelType, EmbedBuilder, Message, Permissions, PermissionsBitField, TextChannel } from "discord.js";
import { JSONToMessageOptions } from "../../lib/GreetHandler";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/KaikiEmbeds";

type argumentMessage = {
    [str: string]: string | any
} | string

export default class SayCommand extends KaikiCommand {
    constructor() {
        super("say", {
            aliases: ["say"],
            description: "Bot will send the message you typed in the specified channel. It also takes embeds",
            usage: ["#general hello from another channel", "<embed code>"],
            channel: "guild",
            userPermissions: PermissionsBitField.Flags.ManageMessages,
            * args() {
                const targetChannel = yield {
                    type: "textChannel",
                    default: (m: Message) => m.channel,
                };

                if (Argument.isFailure(targetChannel)) {
                    return {
                        argMessage: yield {
                            match: "rest",
                            type: (message, phrase) => {
                                try {
                                    return JSON.parse(message.content.substring(message.content.indexOf("{")));
                                }
                                catch {
                                    return phrase.trim();
                                }
                            },
                            otherwise: (m) => ({
                                embeds: [
                                    new EmbedBuilder()
                                        .setDescription("Please provide arguments!")
                                        .withErrorColor(m),
                                ],
                            }),
                        },
                    };
                }

                else {
                    const argMessage = yield {
                        match: "rest",
                        type: async (message, phrase) => {
                            try {
                                return JSON.parse(message.content.substring(message.content.indexOf("{")));
                            }
                            catch {
                                const argArr: string[] = message.content.split(" ");

                                if (argArr.length === 1) return null;

                                let index: number = argArr.indexOf(phrase.split(" ")[0]) - (argArr.length > 2
                                    ? 1
                                    : 0);

                                if (await Argument.cast("textChannel", message.client.commandHandler.resolver, message, argArr[index])) {
                                    index = index + 1;
                                }

                                return argArr.slice(index).join(" ");

                            }
                        },
                        otherwise: (m) => ({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Please provide arguments!")
                                    .withErrorColor(m),
                            ],
                        }),
                    };
                    return {
                        targetChannel,
                        argMessage,
                    };
                }
            },
        });
    }

    public async exec(message: Message<true>, {
        targetChannel,
        argMessage,
    }: { targetChannel: TextChannel, argMessage: argumentMessage }): Promise<Message | void> {

        if (message.channel.type !== ChannelType.GuildText) return;

        if (message.member && !message.member.permissionsIn(targetChannel).has(PermissionsBitField.Flags.ManageMessages)) {
            return message.channel.send({ embeds: [await KaikiEmbeds.errorMessage(message, `You do not have \`MANAGE_MESSAGES\` in ${targetChannel}`)] });
        }

        return targetChannel.send(typeof argMessage !== "object"
            ? { content: argMessage }
            : new JSONToMessageOptions(argMessage));
    }
}

