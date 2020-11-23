import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../util/embeds";
import { getMemberColorAsync } from "../../util/Util";

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
					otherwise: (msg: Message) => noArgGeneric(msg.util?.parsed?.command),
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
			color: await getMemberColorAsync(message),
		}));
	}
}