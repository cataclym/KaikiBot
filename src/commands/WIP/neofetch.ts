/* eslint-disable no-useless-escape */
import { Command } from "discord-akairo";
import { exec } from "child_process";
import { Message } from "discord.js";
import { codeblock, trim } from "../../util/Util";
import { logger } from "../../util/logger";
export default class NeofetchCommand extends Command {
	constructor() {
		super("neofetch", {
			aliases: ["neofetch", "neo"],
			description: { description: "display neofetch ascii art", usage: "opensuse" },
			cooldown: 2000,
			typing: true,
			args: [{
				id: "os",
				type: "string",
				default: "bedrock",
			}],
		});
	}
	public async exec(message: Message, { os }: { os: string }): Promise<void> {

		exec("whoami", (err, out, stdrr) => {
			if (err) {
				return logger.high(err);
			}
			if (stdrr) {
				return logger.high(stdrr);
			}

			return neofetch(out.trim());
		});

		function neofetch(username: string) {
			exec(`neofetch --ascii_distro ${os}|sed 's/\x1B\[[0-9;\?]*[a-zA-Z]//g'`, async (error, stdout, stderr) => {
				if (error) {
					return logger.high(error);
				}
				if (stderr) {
					return logger.high(stderr);
				}

				return message.channel.send(await codeblock(stdout.substring(0, stdout.indexOf(username + "@")).replace(/```/g, "\u0300``\u0300`")));
			});
		}
	}
}