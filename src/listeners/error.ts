/* eslint-disable indent */
import { Command, Listener } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import logger from "loglevel";
import { cmdStatsCache } from "../cache/cache";
import { listenerLog } from "../lib/Util";


export default class errorListener extends Listener {
	constructor() {
		super("error", {
			event: "error",
			emitter: "commandHandler",
		});
	}

	public async exec(error: Error, message: Message, command: Command): Promise<void> {

        listenerLog(message, this, logger.warn, command, `${error.stack}\n`);

		cmdStatsCache[command.id]
			? cmdStatsCache[command.id]++
			: cmdStatsCache[command.id] = 1;
	}
}

