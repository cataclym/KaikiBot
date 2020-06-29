const db = require("quick.db");
const UserNickTable = new db.table("UserNickTable");

module.exports = {
	name: "updatenames",
	aliases: ["updatename", "up"],
	description: "Updates names in the databse for the `names` command",
	args: true,
	usage: "50",
	async execute(message, args) {

		let nr = parseInt(args[0], 10);

		if (isNaN(parseFloat(nr))) {
			return message.channel.send("Not a Number");
		}
		if (nr > 100) nr = 100; // Can max fetch 100 in one go. Would be nice to grab more...

		const updates = await message.guild.fetchAuditLogs({ 
			type: "GUILD_MEMBER_UPDATE", 
			limit: nr,
			user: message.client.user
		});
		if (!updates) { // Doubt this will ever happen
			return console.log("Update names: No updates found."); 
		}

		const amount = new Array(); // Array to be used for counting
		for (const [i, x] of updates.entries) {
			const {target, changes } = x;
			if (changes.map(c => c.key) != "nick") {
				continue;	// Skips changes that arent nicknames
			}
			await UserNickTable.push(`usernicknames.${target.id}`, changes.map(c => c.new));
			amount.push("Item"); // Adds to array 
		}
		if (updates) {
			const ArrLngth = amount.length; // Counts the amount of names that were updated
			await message.channel.send(`Fetched ${nr} updates. Stored ${ArrLngth} names.`);
		}
	},
};