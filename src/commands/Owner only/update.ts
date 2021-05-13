import { Command } from "@cataclym/discord-akairo";
import { exec } from "child_process";
import { Message } from "discord.js";
import logger from "loglevel";
import { codeblock, trim } from "../../lib/Util";
export default class UpdateCommand extends Command {
	constructor() {
		super("update", {
			aliases: ["update"],
			ownerOnly: true,
		});
	}
	public async exec(message: Message): Promise<void> {
		exec("git pull", async (err, std) => {
			if (err) {
				logger.error(err);
				return message.channel.send(err.message);
			}
			exec("git describe --tags", async (error, stdVer) => {
				if (error) {
					logger.error(error);
					return message.channel.send(error.message);
				}
				return message.channel.send(`Log:\n${await codeblock(trim(std, 1000))}\nUpdated ${message.client.user?.tag} to ${stdVer}`);
			});
		});
	}
}