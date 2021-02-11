import { Command, Argument } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { IUser } from "../../interfaces/db";
import { getUserDB } from "../../struct/db";

export default class todoRemoveCommand extends Command {
	constructor() {
		super("remove", {
			args: [
				{
					id: "toRemove",
					index: 0,
					type: Argument.union("integer", "string"),
					otherwise: "Please specify number to delete from list, or 'first'/'last'/'all'",
				},
			],
		});
	}
	public async exec(message: Message, { toRemove }: { toRemove: number | string }): Promise<IUser | Message> {

		const { author } = message, userDB = await getUserDB(author.id);

		if (!userDB.todo.length) {
			return message.channel.send("Nothing to delete.");
		}

		if (typeof toRemove === "number") {
			// Matches given number to array item
			const index = Math.floor(toRemove - 1),
				removedItem = userDB.todo.splice(index, 1),
				stringified = removedItem?.toString().replace(/,/g, " ").substring(0, 46);
			message.reply(`Removed \`${stringified}\` from list.`).then(SentMsg => {
				SentMsg.react("✅");
			});
		}

		else {
			switch (toRemove) {
				case "all": {
					userDB.todo = [];
					message.channel.send("List deleted.").then(SentMsg => {
						SentMsg.react("✅");
					});
					break;
				}
				case "last": {
				// This gets repeated unnecessarily
					const removedItem = userDB.todo.pop();
					const stringified = removedItem?.toString().replace(/,/g, " ").substring(0, 46);
					// Returns removedItem with space
					message.reply(`Removed \`${stringified}\` from list.`).then(SentMsg => {
						SentMsg.react("✅");
					});
					break;
				}
				case "first": {
					const removedItem = userDB.todo.shift();
					const stringified = removedItem?.substring(0, 46);
					message.reply(`Removed \`${stringified}\` from list.`).then(SentMsg => {
						SentMsg.react("✅");
					});
				}
			}
		}
		return userDB.save();
	}
}
