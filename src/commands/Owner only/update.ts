import { Command } from "@cataclym/discord-akairo";
import { exec } from "child_process";
import { Message } from "discord.js";
import { codeblock, trim } from "../../lib/Util";
import fs from "fs";
import logger from "loglevel";
import * as path from "path";

export default class UpdateCommand extends Command {
	constructor() {
		super("update", {
			aliases: ["update"],
			ownerOnly: true,
		});
	}
	public async exec(message: Message): Promise<void> {

		try {
			await new Promise((resolve, reject) => {
				exec("sh update.sh", async (e) => {
					if (e) {
						reject(e.message);
						throw new Error(e.message);
					}
					return resolve(null);
				});
			});

			const std: string = await new Promise((resolve, reject) => {
				exec("git pull", async (err, s) => {
					if (err) {
						reject(err.message);
						throw new Error(err.message);
					}
					return resolve(s);
				});
			});

			const obj: { msg: Message, content: string } = await new Promise((resolve, reject) => {
				exec("git describe --tags", async (error, stdv) => {
					if (error) {
						throw new Error(error.message);
					}
					const content = `Log:\n${await codeblock(trim(std, 1000))}\nUpdated ${message.client.user?.tag} to ${stdv}`;
					const msg = await message.channel.send(content + "\nRunning compiler...");

					fs.rename(path.join("dist"), path.join("dist_backup"), (_) => logger.info(_));

					return resolve({ msg, content });
				});
			});

			const { msg, content } = obj;

			await new Promise((resolve, reject) => {
				exec("npm run build", async (_error, tscOutput) => {
					if (_error) {
						fs.rename(path.join("dist_backup"), path.join("dist"), (_) => logger.info(_));
						reject(_error.message);
						throw new Error(_error.message);
					}
					return resolve(msg.edit(`${content}\n**Compile finished**\n${await codeblock(trim(tscOutput, 200))}`));
				});
			});
		}
		catch (e) {
			throw new Error("An error occurred during update. Please update manually\nGITLAB LINK TO GUIDE HERE.");
			// TODO: add link to update.md on gitlab
		}
	}
}