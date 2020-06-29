const db = require("quick.db");
const ReminderList = new db.table("ReminderList");


module.exports = {
	name: "todo",
	aliases: ["remindme",],
	description: "a todo list",
	args: true,
	usage: "make cake sometime",
	async execute(message, args) {
		try {
			const guildmemb = message.author;
			await ReminderList.push(`${guildmemb.id}`, args );
			await message.react("✅");
		}
		catch (error) {
			await console.error("Failed to add todo...");
			await message.react("❌");
			await message.react("⚠️");
		}
	},
};