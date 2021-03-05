import { Command } from "@cataclym/discord-akairo";
import { exec } from "child_process";
import { Message } from "discord.js";
import { codeblock } from "../../nsb/Util";
import { logger } from "../../nsb/Logger";

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
				logger.high(err);
				return message.channel.send(err.message);
			}
			exec("git describe --tags", async (error, stdVer) => {
				if (error) {
					logger.high(error);
					return message.channel.send(error.message);
				}
				return message.channel.send(`Log:\n${await codeblock(std, undefined)}\nUpdated ${message.client.user?.tag} to ${stdVer}`);
			});
		});
	}
}