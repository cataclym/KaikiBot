"use strict";
import db from "quick.db";
const ReminderList = new db.table("ReminderList");
import { Message, MessageEmbed } from "discord.js";
import { Command, Flag, Argument, PrefixSupplier } from "discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { trim } from "../../util/Util.js";
module.exports = class TodoCommand extends Command {
	constructor() {
		super("todo", {
			aliases: ["todo", "note"],
			description: {
				description: "A personal todo list",
				usage: ["", "add make cake 07/07/2020", "remove 5", "remove last", "remove first", "todo remove all"],
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

	public async exec(message: Message) {
		const color = await message.getMemberColorAsync(), reminder: { todo: unknown[] | undefined } = ReminderList.fetch(`${message.author.id}`);
		let reminderArray;
		reminder?.todo?.length ? reminderArray = reminder.todo.map((a: unknown[]) => a.join(" ")) : reminderArray = ["Empty list"];
		const pages = [];
		for (let index = 30, p = 0; p < reminderArray.length; index = index + 30, p = p + 30) {
			const embed = new MessageEmbed()
				.setTitle("Todo")
				.setAuthor(message.author.tag)
				.setThumbnail("https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png")
				.setColor(color)
				.setDescription(trim(reminderArray.map((item: string, i: number) => `${+i + 1}. ${item}`).slice(p, index).join("\n") + `\n\nTo learn more about the command, type \`${(this.handler.prefix as PrefixSupplier)(message)}help todo\``, 2048));
			pages.push(embed);
		}
		await editMessageWithPaginatedEmbeds(message, pages, {});
	}
};