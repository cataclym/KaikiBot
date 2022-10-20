import { EmbedBuilder, Message, Permissions, PermissionsBitField, TextChannel } from "discord.js";
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
            usage: ["#general hello"],
            channel: "guild",
            userPermissions: PermissionsBitField.Flags.ManageMessages,
            args: [
                {
                    id: "channel",
                    type: "textChannel",
                    otherwise: async m => ({ embeds: [await KaikiEmbeds.errorMessage(m, "Please provide a (valid) channel!")] }),
                },
                {
                    id: "argMessage",
                    type: (message, phrase) => {
                        try {
                            return JSON.parse(message.content.substring(message.content.indexOf(phrase)));
                        }
                        catch {
                            return message.content.substring(message.content.indexOf(phrase));
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
            ],
        });
    }

    public async exec(_: Message, {
        channel,
        argMessage,
    }: { channel: TextChannel, argMessage: argumentMessage }): Promise<Message> {

        if (_.member && !_.member.permissionsIn(channel).has(PermissionsBitField.Flags.ManageMessages)) {
            return _.channel.send({ embeds: [await KaikiEmbeds.errorMessage(_, `You do not have \`MANAGE_MESSAGES\` in ${channel}`)] });
        }

        return channel.send(typeof argMessage !== "object"
            ? { content: argMessage }
            : new JSONToMessageOptions(argMessage));
    }
}
