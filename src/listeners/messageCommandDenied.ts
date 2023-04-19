import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions, MessageCommandDeniedPayload, UserError } from "@sapphire/framework";
import { EmbedBuilder, MessageCreateOptions } from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCommandDenied,
})
export default class MessageCommandDenied extends Listener {

    // Ran when precondition check blocks a command

    public async run(error: UserError, payload: MessageCommandDeniedPayload): Promise<void> {

        const messageOptions: MessageCreateOptions = {
            embeds:
                [
                    new EmbedBuilder({
                        title: error.name,
                        description: error.message,
                        footer: { text: error.identifier },
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
