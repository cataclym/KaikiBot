"use strict";
import db from "quick.db";
const ReminderList = new db.table("ReminderList");
import { Message, MessageEmbed } from "discord.js";
import { Command, Flag, Argument, PrefixSupplier } from "@cataclym/discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { trim } from "../../nsb/Util.js";
module.exports = class TodoCommand extends Command {
	constructor() {
		super("todo", {
			aliases: ["todo", "note"],
			description: {
				description: "A personal todo list. The items are limited to 204 characters. Intended for small notes, not detailed cooking recipies.",
				usage: ["", "add make cake 07/07/2020", "remove 5", "remove last", "remove first", "remove all"],
			},
		});
	}
	*args() {
		const method = yield {
			type: [
				["add"],
				["remove", "rem", "delete", "del", "rm"],
			],
		};
		if (!Argument.isFailure(method)) {
			return Flag.continue(method);
		}
	}

	public async exec(message: Message) {
		const color = await message.getMemberColorAsync(), reminder: { todo: [][] | undefined } = ReminderList.fetch(`${message.author.id}`),
			reminderArray = (reminder?.todo?.length ? reminder.todo.map((a: string[]) => trim(a.join(" ").split(/\r?\n/).join(" "), 204)) : ["Empty list"]), pages = [];

		for (let index = 10, p = 0; p < reminderArray.length; index = index + 10, p = p + 10) {
			const embed = new MessageEmbed()
				.setTitle("Todo")
				.setAuthor(`${message.author.tag} 📔 To learn more about the command, type \`${(this.handler.prefix as PrefixSupplier)(message)}help todo\``)
				.setThumbnail("https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png")
				.setColor(color)
				.setDescription(reminderArray.map((item: string, i: number) => `${+i + 1}. ${item}`).slice(p, index).join("\n"));
			pages.push(embed);
		}

		await editMessageWithPaginatedEmbeds(message, pages, {});
	}
};