import { Command } from "@cataclym/discord-akairo";
import { exec } from "child_process";
import { Message } from "discord.js";
import { codeblock, trim } from "../../lib/Util";

export default class UpdateCommand extends Command {
	constructor() {
		super("update", {
			aliases: ["update"],
			ownerOnly: true,
		});
	}
	public async exec(message: Message): Promise<void> {

		exec("sh update.sh", (e) => {
			if (e) {
				throw new Error(e.message);
			}
			exec("git pull", async (err, std) => {
				if (err) {
					throw new Error(err.message);
				}
				exec("git describe --tags", async (error, stdVer) => {
					if (error) {
						throw new Error(error.message);
					}
					return message.channel.send(`Log:\n${await codeblock(trim(std, 1000))}\nUpdated ${message.client.user?.tag} to ${stdVer}`);
				});
			});
		});
	}
}