import { Command } from "@cataclym/discord-akairo";
import { Message, MessageReaction } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { getUserDB } from "../../struct/db";
export default class todoAddCommand extends Command {
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
	public async exec(message: Message, { toAdd }: { toAdd: string}): Promise<MessageReaction> {
		await getUserDB(message.author.id).then(db => {
			db.todo.push(toAdd);
			db.markModified("todo");
			db.save();
		});
		return message.react("✅");
	}
}
