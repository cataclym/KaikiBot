"use strict";
import db from "quick.db";
const ReminderList = new db.table("ReminderList");
import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { noArgGeneric } from "../../nsb/Embeds";
module.exports = class todoAddCommand extends Command {
	constructor() {
		super("add", {
			args: [
				{
					id: "toAdd",
					type: "string",
					match: "rest",
					otherwise: (msg: Message) => noArgGeneric(msg),
				},
			],
		});
	}
	public async exec(message: Message, { toAdd }: { toAdd: string}) {
		ReminderList.push(`${message.author.id}.todo`, toAdd.split(/ +/));
		return message.react("✅");
	}
};
