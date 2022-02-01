import { Command, Listener } from "discord-akairo";
import { Message } from "discord.js";
import logger from "loglevel";
import { cmdStatsCache } from "../cache/cache";
import KaikiEmbeds from "../lib/KaikiEmbeds";
import Utility from "../lib/Utility";

export default class errorListener extends Listener {
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

        cmdStatsCache[command.id]
            ? cmdStatsCache[command.id]++
            : cmdStatsCache[command.id] = 1;
    }
}
