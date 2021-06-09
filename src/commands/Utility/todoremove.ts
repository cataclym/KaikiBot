import { Argument, Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { IUser } from "../../interfaces/db";
import { getUserDocument } from "../../struct/documentMethods";

export default class todoRemoveCommand extends Command {
	constructor() {
		super("remove", {
			args: [
				{
					id: "toRemove",
					index: 0,
					type: Argument.union("integer", ["first", "last", "all"]),
					otherwise: "Please specify number to delete from list, or 'first'/'last'/'all'",
				},
			],
		});
	}
	public async exec(message: Message, { toRemove }: { toRemove: number | "first" | "last" | "all" }): Promise<IUser | Message> {

		const { author } = message, userDB = await getUserDocument(author.id);

		if (!userDB.todo.length) {
			return message.channel.send("Nothing to delete.");
		}

		let removedItem = undefined;

		if (typeof toRemove === "number") {
			// Matches given number to array item
			removedItem = userDB.todo.splice(toRemove - 1, 1).toString();
		}

		else {
			switch (toRemove) {
				case "all": {
					userDB.todo = [];
					break;
				}
				case "last": {
					removedItem = userDB.todo.pop();
					break;
				}
				case "first": {
					removedItem = userDB.todo.shift();
					break;
				}
			}
		}

		userDB.markModified("todo");

		if (!removedItem) {
			message.channel.send("List deleted.")
				.then(SentMsg => {
					SentMsg.react("✅");
				});
		}

		else {
			removedItem = removedItem?.substring(0, 46);
			message.reply(`Removed \`${removedItem}\` from list.`)
				.then(SentMsg => {
					SentMsg.react("✅");
				});
		}

		return userDB.save();
	}
}
