const db = require("quick.db");
const ReminderList = new db.table("ReminderList");
const Discord = require("discord.js");
const { prefix } = require("../config.js");


module.exports = {
	name: "todo",
	aliases: ["note", "list"],
	description: "A personal todo list",
	// args: true,
	usage: `(Displays list)\n${prefix}todo add make cake 07/07/2020\n${prefix}todo remove 5\n${prefix}todo remove last\n${prefix}todo remove first\n${prefix}todo remove all`,
	cmdCategory: "Utility",
	async execute(message, args) {

		if (args[0] === "add") {
			try {
				args.shift();
				if (args[0] == null) {
					return message.reply(`**Proper usage would be**:\n${prefix}todo add <item>\n${prefix}todo delete <nr>`);
				}
				else {
					ReminderList.push(`${message.author.id}`, args);
					return message.react("✅");
				}
			}
			catch (error) {
				console.error("Failed to add todo... " + error);
				await message.react("❌");
				return message.react("⚠️");
			}
		}
		if (args[0] === "rem" || args[0] === "remove" || args[0] === "delete" || args[0] === "del") {
			try {
				const guildmemb = message.author;
				const reminder = ReminderList.fetch(`${message.author.id}`);
				if (reminder === null || !Array.isArray(reminder)) {
					return message.channel.send("Nothing to delete.");
				}
				switch (args[1]) {
					case "all": {
					// This first so we dont run into the map shit...
						if (ReminderList.delete(`${message.author.id}`)) {
							return message.channel.send("List deleted.").then(SentMsg => {
								SentMsg.react("✅");
							});
						}
						else {
							console.log(Error);
							return message.channel.send(Error);
						// Stop execution here if errored
						}
					}
					case "last": {
						const combinedReminders = reminder.map(a => a);
						// This gets repeated unnecessarily
						const removedItem = combinedReminders.pop();
						// Assigns the last entry to removedItem
						ReminderList.set(guildmemb.id, combinedReminders);
						const stringified = removedItem.toString().replace(/,/g, " ").substring(0, 46);
						// Returns removedItem with space
						return message.channel.send(`Removed \`${stringified}\` from list.`).then(SentMsg => {
							SentMsg.react("✅");
						});
					}
					case "first": {
						const combinedReminders = reminder.map(a => a);
						const firstremovedItem = combinedReminders.shift();
						// Assigns the first entry to removedItem
						ReminderList.set(guildmemb.id, combinedReminders);
						const firststringified = firstremovedItem.toString().replace(/,/g, " ").substring(0, 46);
						// Returns removedItem with space
						return message.channel.send(`Removed \`${firststringified}\` from list.`).then(SentMsg => {
							SentMsg.react("✅");
						});
					}
				}
				if (isNaN(args[1])) {
					return message.channel.send("Please provide a valid number.");
				}
				if (args[1]) {
					const combinedReminders = reminder.map(a => a);
					const index = parseInt(args[1], 10) - 1;
					// Matches given number to array item
					const removedItem = combinedReminders.splice(index, 1);
					ReminderList.set(guildmemb.id, combinedReminders);
					const stringified = removedItem.toString().replace(/,/g, " ").substring(0, 46);
					// Returns removedItem with space
					return message.channel.send(`Removed \`${stringified}\` from list.`).then(SentMsg => {
						SentMsg.react("✅");
					});
				}
			}
			catch (error) {
				return console.log("Failed to remove todo...", error);
			}
		}
		if (args[0]) {
			await message.reply(`**Proper usage would be**:\n${prefix}todo add <item>\n${prefix}todo delete <nr>`);
		}

		else {
			try {
				const color = message.member.displayColor;
				const guildmemb = message.author;
				const reminder = ReminderList.fetch(`${guildmemb.id}`);
				const combinedParentArray = reminder.map(a => a.join(" "));
				const todolist = combinedParentArray.map((item, i) => `${+i + 1}. ${item}`).join("\n");
				const embed = new Discord.MessageEmbed({
					title: "Todo:",
					description: todolist,
					color,
					thumbnail: {
						url: "https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png",
					},
					footer:  {
						text: `To learn more about the command, type \`${prefix}help todo\``,
					},
				});
				if (combinedParentArray.toString().length > 2048) {
					// Embed limits
					const surplus = embed.description.toString().substring(2045, 2300);
					embed.description = embed.description.toString().substring(0, 2045);
					embed.addField("\u200B", surplus);
					// Maybe iterate something here.
					embed.setFooter("Your list is limited to 2048 characters.");
				}
				return message.channel.send(embed);
			}
			catch (error) {
				console.error("Error displaying todo");
				message.channel.send("You haven't added any todo lists, yet.");
				return message.react("⚠️");
			}
		}
	},
};