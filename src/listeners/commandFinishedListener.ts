import { Command } from "discord-akairo";
import { Message } from "discord.js";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";
import Utility from "../lib/Utility";

export default class CommandFinishedListener extends KaikiListener {
    constructor() {
        super("commandFinished", {
            event: "commandFinished",
            emitter: "commandHandler",
        });
    }

    public async exec(message: Message, command: Command): Promise<void> {

        await Utility.listenerLog(message, this, logger.info, command);

        let cmd = this.client.cache.cmdStatsCache.get(command.id);

        cmd
            ? this.client.cache.cmdStatsCache.set(command.id, cmd++)
            : this.client.cache.cmdStatsCache.set(command.id, 1);

    }
}
