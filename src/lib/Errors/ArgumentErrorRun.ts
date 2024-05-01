import { EmbedBuilder, MessageCreateOptions } from "discord.js";
import { MessageCommandDeniedPayload, UserError } from "@sapphire/framework";

export default async (
    error: UserError,
    payload: MessageCommandDeniedPayload
) => {
    const messageOptions: MessageCreateOptions = {
        embeds: [
            new EmbedBuilder({
                title: "Argument error",
                description: error.message,
            }).withErrorColor(payload.message),
        ],
    };

    if (payload.message.interaction) {
        Object.assign(messageOptions, { ephemeral: true });
    }

    await payload.message.reply(messageOptions);
};
