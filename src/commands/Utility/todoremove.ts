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
					type: Argument.union("integer", ["first", "last", "all"]),
					otherwise: "Please specify number to delete from list, or 'first'/'last'/'all'",
				},
			],
		});
	}
	public async exec(message: Message, { toRemove }: { toRemove: number | "first" | "last" | "all" }): Promise<IUser | Message> {

		const { author } = message, userDB = await getUserDB(author.id);

		if (!userDB.todo.length) {
			return message.channel.send("Nothing to delete.");
		}

		let removedItem = undefined;

		if (typeof toRemove === "number") {
			// Matches given number to array item
			removedItem = userDB.todo.splice(toRemove, 1);
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

			if (!removedItem) {
				message.channel.send("List deleted.")
					.then(SentMsg => {
						SentMsg.react("✅");
					});
			}
			else {
				const stringified = removedItem?.substring(0, 46);
				message.reply(`Removed \`${stringified}\` from list.`)
					.then(SentMsg => {
						SentMsg.react("✅");
					});
			}
		}
		userDB.markModified("todo");
		return userDB.save();
	}
}
