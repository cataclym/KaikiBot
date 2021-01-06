/* eslint-disable no-useless-escape */
import { Command } from "@cataclym/discord-akairo";
import { exec } from "child_process";
import { Message, MessageEmbed } from "discord.js";
import { codeblock } from "../../nsb/Util";
import { logger } from "../../nsb/Logger";
import { distros } from "../../nsb/distros.json";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";

export default class NeofetchCommand extends Command {
	constructor() {
		super("neofetch", {
			aliases: ["neofetch", "neo"],
			description: { description: "Displays neofetch ascii art", usage: ["", "opensuse", "list"] },
			cooldown: 2000,
			typing: true,
			args: [{
				id: "os",
				type: distros,
				default: `${process.platform}`,
			},
			{
				id: "list",
				flag: ["list"],
				match: "flag",
			}],
		});
	}
	public async exec(message: Message, { os, list }: { os: string, list: boolean }): Promise<Message | void> {

		if (list) {
			const pages: MessageEmbed[] = [];
			const sortedDistros = distros.sort().filter(n => n);
			for (let i = 150, p = 0; p < sortedDistros.length; i = i + 150, p = p + 150) {
				pages.push(new MessageEmbed()
					.setTitle("Neofetch ascii art list")
					.setColor(await message.getMemberColorAsync())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setDescription(await codeblock(sortedDistros.slice(p, i).join(", "), "json")));
			}
			return editMessageWithPaginatedEmbeds(message, pages, {});
		}

		else {
			exec("whoami", (err, out, stdrr) => {
				if (err) {
					return logger.high(err);
				}
				if (stdrr) {
					return logger.high(stdrr);
				}

				return neofetch(out.trim());
			});
		}

		function neofetch(username: string) {
			exec(`neofetch --ascii_distro ${os}|sed 's/\x1B\[[0-9;\?]*[a-zA-Z]//g'`, async (error, stdout, stderr) => {
				if (error) {
					return logger.high(error);
				}
				if (stderr) {
					return logger.high(stderr);
				}

				return message.channel.send(await codeblock(stdout.substring(0, stdout.indexOf(username + "@")).replace(/```/g, "\u0300`\u0300`\u0300`\u0300")));
			});
		}
	}
}