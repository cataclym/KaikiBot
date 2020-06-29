const db = require("quick.db");
const UserNickTable = new db.table("UserNickTable");

module.exports = {
	name: "updatenames",
	aliases: ["updatename", "up"],
	description: "",
	args: true,
	usage: "type the command",
	async execute(message, args) {

		args[0] = args[0].substring(0,2);

		const nr = parseInt(args[0], 10);

		if (isNaN(parseFloat(nr))) {
			return message.channel.send("Not a Number");
		}

		const updates = await message.guild.fetchAuditLogs({ 
			type: "GUILD_MEMBER_UPDATE", 
			limit: nr,
			user: message.client.user
		});
		if (!updates) { 
			return console.log("Update names: No updates found."); 
			
		}
		const amount = new Array(); 
		for (const [i, x] of updates.entries) {
			const { executor, target, changes } = x;
			if (changes.map(c => c.key) != "nick") {
				continue;
			}
			UserNickTable.push(`usernicknames.${target.id}`, changes.map(c => c.new));
			amount.push("Item");
		}
	
		if (updates) {

			const ArrLngth = amount.length;
			//await ReminderList.push(target.id, changes.new);
			message.channel.send(`Updated ${ArrLngth} names.`);
		}
	},
};