const { msToTime } = require("../../functions/functions");
const { Command } = require("discord-akairo");
const shardStats = {
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
			name: "shardstats",
			aliases: ["shards", "shardstats"],
			description: "Shows state of shards, if any",
		});
	}
	async exec(message) {
		const pages = [];
		message.client.ws.shards.each(element => {
			pages.push("ID: **#" + element.id + "** | status: **" + shardStats[element.status] + "** | ping: **" + element.ping + "** | Last ping: " + msToTime(message.createdTimestamp - element.lastPingTimestamp) + " | Connected to **" + message.client.guilds.cache.size + "** servers.");
		});
		message.channel.send(pages.join("\n"));
	}
};