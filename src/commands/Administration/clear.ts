import { Command } from "discord-akairo";
import { Channel, TextChannel } from "discord.js";

export default class ClearCommand extends Command {
	constructor() {
		super("clear", {
			aliases: ["clear", "prune"],
			userPermissions: "MANAGE_MESSAGES",
			clientPermissions: "MANAGE_MESSAGES",
			channel: "guild",
			description: { description: "Clears up to 100 messages in the current channel.", usage: "69" },
			args: [
				{
					id: "int",
					type: "integer",
					default: 0,
				},
			],
		});
	}
	public async exec({ channel }: { channel: Channel }, { int }: { int: number }): Promise<void> {

		int > 99 ? int = 99 : null;

		(channel as TextChannel).bulkDelete(int + 1)
			.catch((r) => console.error(r));

	}
}