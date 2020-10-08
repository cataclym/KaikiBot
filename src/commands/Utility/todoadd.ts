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
					index: 0,
					match: "rest",
				},
			],
		});
	}
	async exec(message: Message, args: string) {
		ReminderList.push(`${message.author.id}`, args.split(/ +/));
		return message.react("✅");
	}
};
