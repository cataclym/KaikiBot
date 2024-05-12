import { ApplyOptions } from "@sapphire/decorators";
import {
    Command,
    Events,
    Listener,
    ListenerOptions,
} from "@sapphire/framework";
import * as colorette from "colorette";
import { Message } from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCommandFinish,
})
export class MessageCommandFinish extends Listener {
    public async run(message: Message, command: Command) {
        const guildStr = message.inGuild()
            ? `Guild: ${colorette.greenBright(message.guild.name)} [${colorette.greenBright(message.guildId)}]`
            : `DM Channel: [${colorette.greenBright(message.channelId)}]`

        this.container.logger.info(
            `      > Command: ${colorette.greenBright(command.name)}
        User: ${colorette.greenBright(message.author.username)} [${colorette.greenBright(message.author.id)}]
       
        a ${guildStr}`
        );

        message.client.cache.incrementCommand(command.name)
    }
}
