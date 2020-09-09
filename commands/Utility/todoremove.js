"use strict";
const { Argument } = require("discord-akairo");
const db = require("quick.db");
const ReminderList = new db.table("ReminderList");
const { Command } = require("discord-akairo");
module.exports = class todoRemoveCommand extends Command {
	constructor() {
		super("remove", {
			id: "remove",
			alias: ["remove", "rem", "delete", "del"],
			args: [
				{
					id: "toRemove",
					index: 0,
					type: Argument.union("integer", "string"),
					otherwise: "Please specify number to delete from list, or 'first'/'last'/'all'",
				},
			],
		});
	}
	async exec(message, args) {
		const guildMember = message.author, reminder = ReminderList.fetch(`${message.author.id}`);
		if (reminder === null || !Array.isArray(reminder)) {
			return message.channel.send("Nothing to delete.");
		}
		switch (args.toRemove) {
			case "all": {
				// This first so we dont run into the map shit...
				if (ReminderList.delete(`${message.author.id}`)) {
					return message.channel.send("List deleted.").then(SentMsg => {
						SentMsg.react("✅");
					});
				}
				else {
					console.log(Error);
					return message.util.reply(Error);
					// Stop execution here if errored
				}
			}
			case "last": {
				// This gets repeated unnecessarily
				const combinedReminders = reminder.map(a => a), removedItem = combinedReminders.pop();
				// Assigns the last entry to removedItem
				ReminderList.set(guildMember.id, combinedReminders);
				const stringified = removedItem.toString().replace(/,/g, " ").substring(0, 46);
				// Returns removedItem with space
				return message.util.reply(`Removed \`${stringified}\` from list.`).then(SentMsg => {
					SentMsg.react("✅");
				});
			}
			case "first": {
				const combinedReminders = reminder.map(a => a), shiftedItem = combinedReminders.shift();
				ReminderList.set(guildMember.id, combinedReminders);
				const firstRemovedItem = shiftedItem.toString().replace(/,/g, " ").substring(0, 46);
				// Returns removedItem with space
				return message.util.reply(`Removed \`${firstRemovedItem}\` from list.`).then(SentMsg => {
					SentMsg.react("✅");
				});
			}
		}
		if (Number.isInteger(args.toRemove)) {
			// Matches given number to array item
			const combinedReminders = reminder.map(a => a), index = parseInt(args.toRemove, 10) - 1,
				removedItem = combinedReminders.splice(index, 1);
			ReminderList.set(guildMember.id, combinedReminders);
			const removedString = removedItem.toString().replace(/,/g, " ").substring(0, 46);
			// Returns removedItem with space
			return message.util.reply(`Removed \`${removedString}\` from list.`).then(SentMsg => {
				SentMsg.react("✅");
			});
		}
	}
};
