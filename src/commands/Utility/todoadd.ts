import { Command } from "discord-akairo";
import { Message, MessageReaction } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { getUserDocument } from "../../struct/documentMethods";
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
		await getUserDocument(message.author.id).then(db => {
			db.todo.push(toAdd);
			db.markModified("todo");
			db.save();
		});
		return message.react("✅");
	}
}
