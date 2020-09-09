const db = require("quick.db");
const UserNickTable = new db.table("UserNickTable");
const { Command } = require("discord-akairo");

module.exports = class UpdateNames extends Command {
	constructor() {
		super("updatenames", {
			name: "updatenames",
			aliases: ["updatenames", "up"],
			description: { description: "Redundant command." },
			ownerOnly: true,
		});
	}
	async exec(message) {
		// Can max fetch 100 in one go. Would be nice to grab more...
		const updates = await message.guild.fetchAuditLogs({
			type: "GUILD_MEMBER_UPDATE",
			limit: 100,
			user: "714695773534814238",
		});
		if (!updates.entries.size) {
			// Doubt this will ever happen
			return console.log("Update names: No updates found.");
		}

		const amount = [];
		// Array to be used for counting
		for (const [i, x] of updates.entries) {
			const { target, changes } = x;
			if (changes.map(c => c.key).includes("nick")) {
				continue;
				// Skips changes that aren't nicknames
			}
			await UserNickTable.push(`usernicknames.${target.id}`, changes.map(c => c.new).toString());
			amount.push("Item");
			// Adds to array
		}
		if (updates) {
			const ArrLength = amount.length;
			// Counts the amount of names that were updated
			await message.channel.send(`Fetched 100 updates. Stored ${ArrLength} names.`);
		}
	}
};