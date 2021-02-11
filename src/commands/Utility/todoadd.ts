import { Command } from "@cataclym/discord-akairo";
import { Message, MessageReaction } from "discord.js";
import { getUserDB } from "../../struct/db";
import { noArgGeneric } from "../../nsb/Embeds";
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
		const userDB = await getUserDB(message.author.id);
		userDB.todo.push(toAdd);
		userDB.save();
		return message.react("✅");
	}
}
