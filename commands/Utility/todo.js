"use strict";
const db = require("quick.db");
const ReminderList = new db.table("ReminderList");
const { MessageEmbed } = require("discord.js");
const { prefix } = require("../../config.js");
const { Command, Flag, Argument } = require("discord-akairo");
const paginationEmbed = require("discord.js-pagination");

module.exports = class TodoCommand extends Command {
	constructor() {
		super("todo", {
			name: "todo",
			aliases: ["todo", "note"],
			description: {
				description: "A personal todo list",
				usage: `(Displays list)\n${prefix}todo add make cake 07/07/2020\n${prefix}todo remove 5\n${prefix}todo remove last\n${prefix}todo remove first\n${prefix}todo remove all`,
			},
		});
	}
	*args() {
		const method = yield {
			type: [
				["add"],
				["remove", "rem", "delete", "del"],
			],
		};
		if (!Argument.isFailure(method)) {
			return Flag.continue(method);
		}
	}

	async exec(message) {
		const color = message.member.displayColor, reminder = ReminderList.fetch(`${message.author.id}`);
		let reminderArray;
		reminder ? reminderArray = reminder.map(a => a.join(" ")) : reminderArray = ["Empty list"];
		const pages = [];
		for (let index = 30, p = 0; p < reminderArray.length; index = index + 30, p = p + 30) {
			const embed = new MessageEmbed()
				.setTitle("Todo")
				.setAuthor(message.author.tag)
				.setThumbnail("https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png")
				.setColor(color)
				.setDescription(reminderArray.slice(p, index).map((item, i) => `${+i + 1}. ${item}`).join("\n") + `\n\nTo learn more about the command, type \`${prefix}help todo\``);
			pages.push(embed);
		}
		await paginationEmbed(message, pages);
	}
};