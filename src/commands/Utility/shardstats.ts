import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { codeblock } from "../../lib/Util";

interface shards {
	[state: number]: string,
}

const shardStats: shards = {
	0: "READY",
	1: "CONNECTING",
	2: "RECONNECTING",
	3: "IDLE",
	4: "NEARLY",
	5: "DISCONNECTED",
};

module.exports = class ShardStatisticsCommand extends Command {
	constructor() {
		super("shardstats", {
			aliases: ["shards", "shardstats"],
			description: "Shows state of shards",
		});
	}
	public async exec(message: Message) {

		const { ws } = message.client;

		const pages: string[] = [];
		pages.push(`WebSocket: ${shardStats[message.client.ws.status]} | Shards: ${ws.shards.size}/idfk`);
		// Why doesnt this show up??
		ws.shards.each(async (element, d) => {
			pages.push(`ID: #${element.id} | Status: ${shardStats[element.status]} | Heartbeat: ${element.ping} | ${d}`);
		});
		message.util?.send(await codeblock(pages.join("\n"), "json"));
	}
};