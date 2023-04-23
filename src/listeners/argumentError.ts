import { ApplyOptions } from "@sapphire/decorators";
import {
    ArgumentError,
    Events,
    Listener,
    ListenerOptions,
    MessageCommandDeniedPayload,
    UserError,
} from "@sapphire/framework";
import { EmbedBuilder, MessageCreateOptions } from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCommandError,
})
export default class MessageCommandError extends Listener {

    // Ran when precondition check blocks a command

    public async run(error: UserError, payload: MessageCommandDeniedPayload): Promise<void> {

        if (error instanceof ArgumentError) {
            const messageOptions: MessageCreateOptions = {
                embeds:
                    [
                        new EmbedBuilder({
                            title: "Argument error",
                            description: error.message,
                        })
                            .withErrorColor(payload.message),
                    ],
            };

            if (payload.message.interaction) {
                Object.assign(messageOptions, { ephemeral: true });
            }

            await payload.message.reply(messageOptions);
        }
    }
}
