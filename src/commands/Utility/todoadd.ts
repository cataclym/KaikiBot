"use strict";
import db from "quick.db";
const ReminderList = new db.table("ReminderList");
import { Command } from "discord-akairo";
import { Message } from "discord.js";
module.exports = class todoAddCommand extends Command {
	constructor() {
		super("add", {
			args: [
				{
					id: "toAdd",
					type: "string",
					match: "rest",
				},
			],
		});
	}
	async exec(message: Message, { toAdd }: { toAdd: string}) {
		ReminderList.push(`${message.author.id}.todo`, toAdd.split(/ +/));
		return message.react("✅");
	}
};
