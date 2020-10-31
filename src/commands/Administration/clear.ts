import { Command } from "discord-akairo";
import { Channel, TextChannel } from "discord.js";

export default class ClearCommand extends Command {
	constructor() {
		super("clear", {
			aliases: ["clear", "prune"],
			userPermissions: "MANAGE_MESSAGES",
			clientPermissions: "MANAGE_MESSAGES",
			channel: "guild",
			args: [
				{
					id: "int",
					type: "integer",
					default: 1,
				},
			],
		});
	}
	async exec({ channel }: { channel: Channel }, { int }: { int: number }): Promise<void> {

		(channel as TextChannel).bulkDelete(int + 1)
			.catch((r) => console.error(r));

	}
}