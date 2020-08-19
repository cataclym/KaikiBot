const db = require("quick.db");
const UserNickTable = new db.table("UserNickTable");

module.exports = {
	name: "updatenames",
	aliases: ["up"],
	description: "Updates names in the database for the `names` command",
	args: true,
	usage: "50",
	cmdCategory: "Owner only",
	async execute(message, args) {

		if (!message.member.hasPermission("ADMINISTRATOR")) {
			return message.channel.send("You do not have permissions to execute this command.");
		}

		if (args[0] === "duplicate" || args[0] === "duplicates") {
			const fetchd = UserNickTable.get(`usernicknames.${message.member.id}`);
			const nondup = [...new Set(fetchd)];
			return UserNickTable.set(`usernicknames.${message.member.id}`, nondup);
		}
		let nr = parseInt(args[0], 10);

		if (isNaN(parseFloat(nr))) {
			// The better version of random.js :P
			return message.channel.send("Not a Number");
		}
		if (nr > 100) nr = 100;
		// Can max fetch 100 in one go. Would be nice to grab more...

		const updates = await message.guild.fetchAuditLogs({
			type: "GUILD_MEMBER_UPDATE",
			limit: nr,
			user: message.client.user,
		});
		/*
		const IDSort = (a, b) => b.id.localeCompare(a.id, undefined, { numeric: true });
		const [entry: { id: lastID } ] = [...updates.entries.values()].sort(idSort);
		const next100Entries = await message.guild.fetchAuditLogs({
			type: "GUILD_MEMBER_UPDATE",
			limit: nr,
			user: message.client.user, before: lastID });*/

		if (!updates) {
			// Doubt this will ever happen
			return console.log("Update names: No updates found.");
		}

		const amount = [];
		// Array to be used for counting
		for (const x of updates.entries) {
			const { target, changes } = x;
			if (changes.map(c => c.key) != "nick") {
				continue;
				// Skips changes that arent nicknames
			}
			await UserNickTable.push(`usernicknames.${target.id}`, changes.map(c => c.new).toString());
			amount.push("Item");
			// Adds to array
		}
		if (updates) {
			const ArrLngth = amount.length;
			// Counts the amount of names that were updated
			await message.channel.send(`Fetched ${nr} updates. Stored ${ArrLngth} names.`);
		}
	},
};