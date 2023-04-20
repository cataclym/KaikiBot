import { ApplyOptions } from "@sapphire/decorators";
import { Command, Listener, ListenerOptions } from "@sapphire/framework";
import { Message } from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: "MessageCommandFinish",
})
export class MessageCommandFinish extends Listener {
    public async run(message: Message, command: Command) {

        let cmd = message.client.cache.cmdStatsCache.get(command.name);

        cmd
            ? message.client.cache.cmdStatsCache.set(command.name, cmd++)
            : message.client.cache.cmdStatsCache.set(command.name, 1);

    }
}
