"use strict";
import db from "quick.db";
const ReminderList = new db.table("ReminderList");
import { Command, Argument } from "@cataclym/discord-akairo";
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
	public async exec(message: Message, { toRemove }: { toRemove: number | string }) {
		const guildMember = message.author;
		const reminder: { todo: string[] | undefined } = ReminderList.fetch(`${message.author.id}`);
		const combinedReminders = reminder?.todo?.map(a => a);
		if (reminder.todo === null || !Array.isArray(reminder.todo) || !reminder.todo[0]) {
			return message.channel.send("Nothing to delete.");
		}
		switch (toRemove) {
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
				const removedItem = combinedReminders?.pop();
				// Assigns the last entry to removedItem
				combinedReminders ? ReminderList.set(`${guildMember.id}.todo`, combinedReminders) : null;
				const stringified = removedItem?.toString().replace(/,/g, " ").substring(0, 46);
				// Returns removedItem with space
				return message.util?.reply(`Removed \`${stringified}\` from list.`).then(SentMsg => {
					SentMsg.react("✅");
				});
			}
			case "first": {
				const shiftedItem = combinedReminders?.shift();
				combinedReminders ? ReminderList.set(`${guildMember.id}.todo`, combinedReminders) : null;
				const firstRemovedItem = shiftedItem?.toString().replace(/,/g, " ").substring(0, 46);
				// Returns removedItem with space
				return message.util?.reply(`Removed \`${firstRemovedItem}\` from list.`).then(SentMsg => {
					SentMsg.react("✅");
				});
			}
		}
		if (typeof toRemove === "number") {
			// Matches given number to array item
			const index = Math.floor(toRemove - 1),
				removedItem = combinedReminders?.splice(index, 1);
			combinedReminders ? ReminderList.set(`${guildMember.id}.todo`, combinedReminders) : null;
			const removedString = removedItem?.toString().replace(/,/g, " ").substring(0, 46);
			// Returns removedItem with space
			return message.util?.reply(`Removed \`${removedString}\` from list.`).then(SentMsg => {
				SentMsg.react("✅");
			});
		}
	}
};
