/* eslint-disable indent */
import { Command, Listener } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { logger } from "../nsb/Logger";
import { getCommandStatsDB } from "../struct/db";

let cmdStatsCache: {[index: string]: number} = {
};

setInterval(async () => {
	const db = await getCommandStatsDB();

	if (!Object.entries(cmdStatsCache).length) return;

	console.log(cmdStatsCache);
	Object.entries(cmdStatsCache)
		.forEach(async ([id, number]) => {
			db.count[id]
				? db.count[id] += number
				: db.count[id] = number;
		});
	db.markModified("count");
	db.save();

	cmdStatsCache = {};
}, 900000);

export default class commandFinishedListener extends Listener {
	constructor() {
		super("commandFinished", {
			event: "commandFinished",
			emitter: "commandHandler",
		});
	}

	public async exec(message: Message, command: Command): Promise<void> {
		const date = new Date().toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", year: "numeric", month: "numeric", day: "numeric" });

		logger.low(`${date} CommandFinished | ${Date.now() - message.createdTimestamp}ms
		Guild: ${message.guild?.name} [${message.guild?.id}]
		${message.channel.type !== "dm" ? `Channel: #${message.channel.name} [${message.channel.id}]` : ""}
		User: ${message.author.username} [${message.author.id}]
		Executed ${command?.id} | "${message.content}"`);

		cmdStatsCache[command.id]
			? cmdStatsCache[command.id]++
			: cmdStatsCache[command.id] = 1;
	}
}
