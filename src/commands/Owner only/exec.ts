import { Command } from "discord-akairo";
import { ChildProcess, exec } from "child_process";
import { Message, MessageEmbed } from "discord.js";
import { codeblock, trim } from "../../lib/Util";

export default class ExecCommand extends Command {
	constructor() {
		super("exec", {
			aliases: ["exec"],
			ownerOnly: true,
			typing: true,
			args: [
				{
					id: "command",
					type: "string",
					match: "restContent",
				},
			],
		});

	}
	public async exec(message: Message, { command }: { command: string }): Promise<ChildProcess> {

		return exec(command, async (e, stdout) => message.channel.send({ embeds: [new MessageEmbed()
			.setAuthor("Executed command", message.client.user?.displayAvatarURL({ dynamic: true }))
			.setDescription(trim(await codeblock(stdout), 2000))
			.withOkColor(message)] }));
	}
}
