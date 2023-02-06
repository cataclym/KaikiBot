import { Command } from "discord-akairo";
import { Message } from "discord.js";
import logger from "loglevel";
import ArgumentError from "../lib/Errors/ArgumentError";
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

    static sendErrorMsg = async (message: Message<boolean>, error: Error) => message.channel.send({ embeds: [await KaikiEmbeds.errorMessage(message, await Utility.codeblock(error.message, "xl"))] });

    public async exec(error: Error, message: Message, command?: Command): Promise<void> {

        if (error instanceof ArgumentError) {
            await Utility.listenerLog(message, this, logger.warn, command, error.message);
            await ErrorListener.sendErrorMsg(message, error);
        }

        else {
            await Utility.listenerLog(message, this, logger.warn, command, `${error.stack}\n`);
            await ErrorListener.sendErrorMsg(message, error);
        }

        if (!command) return;

        let cmd = this.client.cache.cmdStatsCache.get(command.id);

        cmd
            ? this.client.cache.cmdStatsCache.set(command.id, cmd++)
            : this.client.cache.cmdStatsCache.set(command.id, 1);

    }
}
