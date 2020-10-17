import { Command } from "discord-akairo";
import { Message, MessageReaction } from "discord.js";
import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ReminderList = new db.table("ReminderList");

export default class TodoRestoreCommand extends Command {
	constructor() {
		super("todorestore", {
			aliases: ["todorestore"],
			description: { description: "Restores todo lists from before v3.0.2" },
		});
	}
	public async exec(message: Message): Promise<MessageReaction> {

		const list: undefined | string[] & { todo: undefined | string[] } = ReminderList.get(message.author.id);
		if (!list?.todo?.length && list?.length) {
			ReminderList.delete(`${message.author.id}`);
			ReminderList.set(`${message.author.id}.todo`, list);
			return message.react("✅");
		}
		else {
			return message.react("❌");
		}
	}
}