import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";

export default class ReloadCommand extends Command {
	constructor() {
		super("reload", {
			aliases: ["re", "reload"],
			description: { description: "Reloads a command. Note: It does not run the TypeScript compiler." },
			ownerOnly: true,
			args: [
				{
					id: "command",
					type: "command",
					otherwise: (msg: Message) => noArgGeneric(msg),
				},
			],
		});
	}
	public async exec(message: Message, { command }: { command: Command}): Promise<Message> {

		command.reload();
		return message.channel.send(new MessageEmbed({
			title: "Command reloaded",
			description: command.filepath,
			footer: { text: "Command: " + command.id },
		})
			.withOkColor(message));
	}
}