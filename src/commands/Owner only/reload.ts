import { Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { KaikiCommand } from "kaiki";


export default class ReloadCommand extends KaikiCommand {
	constructor() {
		super("reload", {
			aliases: ["re", "reload"],
			description: "Reloads a command. Note: It does not run the TypeScript compiler.",
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
	public async exec(message: Message, { command }: { command: KaikiCommand}): Promise<Message> {

		command.reload();
		return message.channel.send({
			embeds: [new MessageEmbed({
				title: "Command reloaded",
				description: command.filepath,
				footer: { text: "Command: " + command.id },
			})
				.withOkColor(message)],
		});
	}
}
