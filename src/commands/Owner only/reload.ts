import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util";

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
				},
			],
		});
	}
	async exec(message: Message, { command }: { command: Command}): Promise<Message> {

		command.reload();
		return message.channel.send(new MessageEmbed({
			title: "Command reloaded",
			description: command.filepath,
			footer: { text: "Command: " + command.id },
			color: await getMemberColorAsync(message),
		}));
	}
}