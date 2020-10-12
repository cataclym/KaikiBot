"use strict";
import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
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
		ReminderList.push(`${message.author.id}`, toAdd.split(/ +/));
		return message.react("✅");
	}
};