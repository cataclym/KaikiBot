import { Command, Listener } from "discord-akairo";
import { Message } from "discord.js";
import logger from "loglevel";
import { cmdStatsCache } from "../cache/cache";
import { errorMessage } from "../lib/Embeds";
import { codeblock, listenerLog } from "../lib/Util";


export default class errorListener extends Listener {
	constructor() {
		super("error", {
			event: "error",
			emitter: "commandHandler",
		});
	}

	public async exec(error: Error, message: Message, command?: Command): Promise<void> {

		await listenerLog(message, this, logger.warn, command, `${error.stack}\n`);
		message.channel.send({ embeds: [await errorMessage(message, await codeblock(error.message, "xl"))] });

		if (!command) return;

		cmdStatsCache[command.id]
			? cmdStatsCache[command.id]++
			: cmdStatsCache[command.id] = 1;
	}
}
