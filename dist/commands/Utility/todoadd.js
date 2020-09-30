"use strict";
const db = require("quick.db");
const ReminderList = new db.table("ReminderList");
const { Command } = require("discord-akairo");
module.exports = class todoAddCommand extends Command {
	constructor() {
		super("add", {
			id: "add",
			alias: ["add"],
			args: [
				{
					id: "toAdd",
					index: 0,
					match: "rest",
				},
			],
		});
	}
	async exec(message, args) {
		ReminderList.push(`${message.author.id}`, args.toAdd.split(/ +/));
		return message.react("✅");
	}
};
