import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions, MessageCommandDeniedPayload, UserError } from "@sapphire/framework";
import { EmbedBuilder, MessageCreateOptions } from "discord.js";
import {container} from "@sapphire/pieces";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCommandDenied,
})
export default class MessageCommandDenied extends Listener {

    // Ran when precondition check blocks a command

    public async run(error: UserError, payload: MessageCommandDeniedPayload): Promise<void> {

        this.container.logger.error(`Command: ${payload.command.name} | User: ${payload.message.author} [${payload.message.author.id}] | GID/CID: ${payload.message.guildId || payload.message.channelId} | ${error.name} ${error.message} ${error.identifier} ${error.stack}`);

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
