const { msToTime } = require("../../functions/functions");

module.exports = {
	name: "shardstats",
	aliases: ["shards"],
	description: "Shows state of shards, if any",
	args: false,
	cmdCategory: "Utility",
	async execute(message) {
		const pages = [];
		message.client.ws.shards.each(element => {
			pages.push("ID: **#" + element.id + "** | status: **" + element.status + "** | ping: **" + element.ping + "** | Last ping: " + msToTime(message.createdTimestamp - element.lastPingTimestamp) + " | Connected to **" + message.client.guilds.cache.size + "** servers.");
		});
		message.channel.send(pages);
	},
};