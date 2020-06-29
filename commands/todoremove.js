const db = require("quick.db");
const { prefix } = require("../config.js");
const ReminderList = new db.table("ReminderList");

module.exports = {
	name: "todoremove",
	aliases: ["remrm"],
	description: "Removes todo entries",
	args: true,
	usage: `all | ${prefix}remrm last | ${prefix}remrm 2 | ${prefix}remrm first`,
	async execute(message, args) {
		try {
			const guildmemb = message.author;
			const reminder = ReminderList.fetch(`${guildmemb.id}`);
			if (reminder === null){
				return message.channel.send("Nothing to delete.");
			}
			const combinedReminders = reminder.map(a => a);
			if (args[0] === "all" || args[0] === "last" || args[0] === "first") {
				if (args[0] === "all") {
					await ReminderList.delete(guildmemb.id);
					return message.channel.send("List deleted.").then(SentMsg => {
						SentMsg.react("✅"); 
					});
				}
				if (args[0] === "last") {
					const removedItem = combinedReminders.pop(); // Assigns the last entry to removedItem
					await ReminderList.set(guildmemb.id, combinedReminders);
					const stringified = removedItem.toString().replace(/,/g, " ").substring(0, 46); // Returns removedItem with space
					return message.channel.send(`Removed \`${stringified}\` from list.`).then(SentMsg => {
						SentMsg.react("✅"); 
					});
				}
				if (args[0] === "first") { 
					const removedItem = combinedReminders.shift(); // Assigns the first entry to removedItem
					await ReminderList.set(guildmemb.id, combinedReminders);
					const stringified = removedItem.toString().replace(/,/g, " ").substring(0, 46); // Returns removedItem with space
					return message.channel.send(`Removed \`${stringified}\` from list.`).then(SentMsg => {
						SentMsg.react("✅"); 
					});
				}
			}
			if (isNaN(args[0])) {
				return message.channel.send("Please provide a valid number.");
			}
			if (args[0]) {
				const index = parseInt(args[0], 10) -1; // Matches given number to array item
				const removedItem = combinedReminders.splice(index, 1);
				await ReminderList.set(guildmemb.id, combinedReminders);
				const stringified = removedItem.toString().replace(/,/g, " ").substring(0, 46); // Returns removedItem with space
				await message.channel.send(`Removed \`${stringified}\` from list.`).then(SentMsg => {
					SentMsg.react("✅");
				});
			}
		}
		catch(error) {
			console.log("Failed to remove todo...", error);
		}
	},
};