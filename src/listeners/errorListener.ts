import { Command } from "discord-akairo";
import { Message } from "discord.js";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";
import KaikiEmbeds from "../lib/KaikiEmbeds";
import Utility from "../lib/Utility";

export default class ErrorListener extends KaikiListener {
    constructor() {
        super("error", {
            event: "error",
            emitter: "commandHandler",
        });
    }

    public async exec(error: Error, message: Message, command?: Command): Promise<void> {

        await Utility.listenerLog(message, this, logger.warn, command, `${error.stack}\n`);
        message.channel.send({ embeds: [await KaikiEmbeds.errorMessage(message, await Utility.codeblock(error.message, "xl"))] });

        if (!command) return;

        let cmd = this.client.cache.cmdStatsCache.get(command.id);

        cmd
            ? this.client.cache.cmdStatsCache.set(command.id, cmd++)
            : this.client.cache.cmdStatsCache.set(command.id, 1);

    }
}
