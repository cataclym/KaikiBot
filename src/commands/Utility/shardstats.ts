import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { codeblock } from "../../lib/Util";

const shardStats: {[index: number]: string} = {
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
			channel: "guild",
		});
	}
	public async exec(message: Message) {

		const { ws } = message.client;

		return message.channel.send({ content: await codeblock(`This guild is managed by shard: [${message.guild!.shardId}]`, "xl") +
			await codeblock(Array.from(ws.shards.entries())
				.map(([_, w]) => `ID: [${w.id}] | Ping: ${w.ping}ms | Status: ${shardStats[w.status]}`)
				.join("\n"), "xl"),
		});
	}
};
