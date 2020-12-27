import { Command } from "@cataclym/discord-akairo";
import { Message, WebSocketShard } from "discord.js";

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
			description: "Shows state of shards, if any",
		});
	}
	public async exec(message: Message) {
		const pages: string[] = [];
		pages.push("WebSocket: " + shardStats[message.client.ws.status]);
		// Why doesnt this show up??
		message.client.ws.shards.each((element: WebSocketShard) => {
			pages.push("ID: **#" + element.id + "** | status: **" + shardStats[element.status] + "** | ping: **" + element.ping + "** | Connected to **" + message.client.guilds.cache.size + "** servers.");
		});
		message.util?.send(pages.join("\n"));
	}
};