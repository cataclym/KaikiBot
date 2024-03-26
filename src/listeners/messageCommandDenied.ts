import { ApplyOptions } from "@sapphire/decorators";
import {
    Events,
    Listener,
    ListenerOptions,
    MessageCommandDeniedPayload,
    UserError,
} from "@sapphire/framework";
import * as colorette from "colorette";
import { EmbedBuilder, MessageCreateOptions } from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCommandDenied,
})
export default class MessageCommandDenied extends Listener {
    // Ran when precondition check blocks a command

    public async run(
        error: UserError,
        payload: MessageCommandDeniedPayload
    ): Promise<void> {
        this.container.logger.error(
            `Command: ${colorette.greenBright(payload.command.name)} | User: ${colorette.greenBright(payload.message.author.username)} [${colorette.greenBright(payload.message.author.id)}] | GID/CID: ${colorette.greenBright(payload.message.guildId || payload.message.channelId)} | ${error.name} ${error.message} ${error.identifier} ${error.stack}`
        );

        const messageOptions: MessageCreateOptions = {
            embeds: [
                new EmbedBuilder({
                    title: error.name,
                    description: error.message,
                    footer: { text: error.identifier },
                }).withErrorColor(payload.message),
            ],
        };

        if (payload.message.interaction) {
            Object.assign(messageOptions, { ephemeral: true });
        }

        await payload.message.reply(messageOptions);
    }
}
