import { ApplyOptions } from "@sapphire/decorators";
import { Command, Events, Listener, ListenerOptions } from "@sapphire/framework";
import * as colorette from "colorette";
import { Message } from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCommandFinish,
})
export class MessageCommandFinish extends Listener {
    public async run(message: Message, command: Command) {

        this.container.logger.info(`Command: ${colorette.greenBright(command.name)} | User: ${colorette.greenBright(message.author.username)} [${colorette.greenBright(message.author.id)}] | GID/CID: ${colorette.greenBright(message.guildId || message.channelId)}`);

        let cmd = message.client.cache.cmdStatsCache.get(command.name);

        cmd
            ? message.client.cache.cmdStatsCache.set(command.name, cmd++)
            : message.client.cache.cmdStatsCache.set(command.name, 1);

    }
}
