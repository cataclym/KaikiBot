"use strict";
import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ReminderList = new db.table("ReminderList");
import { Command, Argument } from "discord-akairo";
import { Message } from "discord.js";
module.exports = class todoRemoveCommand extends Command {
	constructor() {
		super("remove", {
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
	async exec(message: Message, args: any) {
		const guildMember = message.author, reminder = ReminderList.fetch(`${message.author.id}`);
		if (reminder === null || !Array.isArray(reminder)) {
			return message.channel.send("Nothing to delete.");
		}
		switch (args.toRemove) {
			case "all": {
				try {
				// This first so we dont run into the map shit...
					ReminderList.delete(`${message.author.id}`);
					return message.channel.send("List deleted.").then(SentMsg => {
						SentMsg.react("✅");
					});
				}
				catch (error) {
					console.log(error);
					return message.util?.reply(error);
				}
			}
			case "last": {
				// This gets repeated unnecessarily
				const combinedReminders = reminder.map(a => a), removedItem = combinedReminders.pop();
				// Assigns the last entry to removedItem
				ReminderList.set(guildMember.id, combinedReminders);
				const stringified = removedItem.toString().replace(/,/g, " ").substring(0, 46);
				// Returns removedItem with space
				return message.util?.reply(`Removed \`${stringified}\` from list.`).then(SentMsg => {
					SentMsg.react("✅");
				});
			}
			case "first": {
				const combinedReminders = reminder.map(a => a), shiftedItem = combinedReminders.shift();
				ReminderList.set(guildMember.id, combinedReminders);
				const firstRemovedItem = shiftedItem.toString().replace(/,/g, " ").substring(0, 46);
				// Returns removedItem with space
				return message.util?.reply(`Removed \`${firstRemovedItem}\` from list.`).then(SentMsg => {
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
			return message.util?.reply(`Removed \`${removedString}\` from list.`).then(SentMsg => {
				SentMsg.react("✅");
			});
		}
	}
};
