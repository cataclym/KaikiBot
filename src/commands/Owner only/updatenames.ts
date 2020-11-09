import db from "quick.db";
const UserNickTable = new db.table("UserNickTable");
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { User } from "discord.js";

module.exports = class UpdateNames extends Command {
	constructor() {
		super("updatenames", {
			aliases: ["updatenames", "up"],
			description: { description: "Redundant command." },
			channel: "guild",
			ownerOnly: true,
		});
	}
	public async exec(message: Message) {
		// Can max fetch 100 in one go. Would be nice to grab more...
		const updates = await message.guild?.fetchAuditLogs({
			type: "MEMBER_UPDATE",
			limit: 100,
			user: message.author,
		});
		if (!updates?.entries.size) {
			// Doubt this will ever happen
			return console.warn(this.id + " | No updates found.");
		}

		let i = 0;
		for (const [, x] of updates.entries) {
			const { target, changes } = x;
			if (!changes?.map(c => c.key).includes("nick")) {
				continue;
				// Skips changes that aren't nicknames
			}
			else if (target instanceof User) {
				UserNickTable.push(`usernicknames.${target?.id}`, changes.map(c => c.new).toString());
				return i++;
			// Adds to array
			}
		}
		if (updates) {
			// Counts the amount of names that were updated
			return message.channel.send(`Fetched 100 updates. Stored ${i} names.`);
		}
	}
};