/* eslint-disable no-useless-escape */
import { Command } from "discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { exec } from "child_process";
import { Message, MessageEmbed } from "discord.js";
import logger from "loglevel";
import { distros } from "../../lib/distros.json";
import { codeblock } from "../../lib/Util";
import { KaikiCommand } from "../../lib/KaikiClass";


export default class NeofetchCommand extends KaikiCommand {
	constructor() {
		super("neofetch", {
			aliases: ["neofetch", "neo"],
			description: "Displays neofetch ascii art",
			usage: ["", "opensuse", "list"],
			cooldown: 2000,
			typing: true,
			args: [{
				id: "os",
				type: distros,
				default: null,
			},
			{
				id: "list",
				flag: ["list"],
				match: "flag",
			}],
		});
	}

	public async exec(message: Message, { os, list }: { os: string | null, list: boolean }): Promise<Message | void> {

		if (list) {
			const pages: MessageEmbed[] = [];
			for (let i = 150, p = 0; p < distros.length; i = i + 150, p = p + 150) {
				pages.push(new MessageEmbed()
					.setTitle("Neofetch ascii art list")
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setDescription(await codeblock(distros.slice(p, i).join(", "), "json"))
					.withOkColor(message));
			}
			return editMessageWithPaginatedEmbeds(message, pages, {});
		}

		else {
			let cmd = `neofetch -L --ascii_distro ${os}|sed 's/\x1B\[[0-9;\?]*[a-zA-Z]//g'`;

			if (!os && process.platform !== "win32") cmd = "neofetch -L |sed 's/\x1B\[[0-9;\?]*[a-zA-Z]//g'";

			exec(cmd, async (error, stdout, stderr) => {
				if (error) {
					return logger.error(error);
				}
				if (stderr) {
					return logger.error(stderr);
				}

				return message.channel.send(await codeblock(stdout.replace(/```/g, "\u0300`\u0300`\u0300`\u0300")));
			});
		}
	}
}
