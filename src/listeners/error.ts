/* eslint-disable indent */
import { Command, Listener } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import logger from "loglevel";
import { cmdStatsCache } from "../cache/cache";


export default class errorListener extends Listener {
	constructor() {
		super("error", {
			event: "error",
			emitter: "commandHandler",
		});
	}

	public async exec(error: Error, message: Message, command: Command): Promise<void> {
		const date = new Date().toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", year: "numeric", month: "numeric", day: "numeric" });

		logger.warn(`${date} error | ${Date.now() - message.createdTimestamp}ms
Guild: ${message.guild?.name} [${message.guild?.id}]
${message.channel.type !== "dm" ? `Channel: #${message.channel.name} [${message.channel.id}]` : ""}
User: ${message.author.username} [${message.author.id}]
Executed ${command?.id} | "${message.content}"
${error.stack}`);

		cmdStatsCache[command.id]
			? cmdStatsCache[command.id]++
			: cmdStatsCache[command.id] = 1;
	}
}

