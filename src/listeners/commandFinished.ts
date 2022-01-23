/* eslint-disable indent */
import { Command, Listener } from "discord-akairo";
import { Message } from "discord.js";
import logger from "loglevel";
import { cmdStatsCache } from "../cache/cache";
import Utility from "../lib/Util";

export default class commandFinishedListener extends Listener {
	constructor() {
		super("commandFinished", {
			event: "commandFinished",
			emitter: "commandHandler",
		});
	}

	public async exec(message: Message, command: Command): Promise<void> {

		await Utility.listenerLog(message, this, logger.info, command);

		cmdStatsCache[command.id]
			? cmdStatsCache[command.id]++
			: cmdStatsCache[command.id] = 1;
	}
}
