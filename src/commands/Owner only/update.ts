import { exec } from "child_process";
import { Message } from "discord.js";
import { codeblock, trim } from "../../lib/Util";
import fs from "fs";
import logger from "loglevel";
import * as path from "path";
import { KaikiCommand } from "kaiki";


export default class UpdateCommand extends KaikiCommand {
	constructor() {
		super("update", {
			aliases: ["update"],
			ownerOnly: true,
		});
	}
	public async exec(message: Message): Promise<void> {

		try {
			await new Promise((resolve, reject) => {
				exec("sh update.sh", async (err) => {
					if (err) {
						reject(err.message);
					}
					return resolve(null);
				});
			});

			await new Promise((resolve, reject) => {
				exec("git stash", async (err, s) => {
					if (err) {
						reject(err.message);
					}
					return resolve(s);
				});
			});

			const std: string = await new Promise((resolve, reject) => {
				exec("git pull", async (err, s) => {
					if (err) {
						reject(err.message);
					}
					return resolve(s);
				});
			});

			const obj: { msg: Message, content: string } = await new Promise((resolve, reject) => {
				exec("git describe --tags", async (err, stdv) => {
					if (err) {
						throw new Error(err.message);
					}
					const content = `Log:\n${await codeblock(trim(std, 1000))}\nUpdated ${message.client.user?.tag} to ${stdv}`;
					const msg = await message.channel.send(content + "\nRunning compiler...");

					fs.rename(path.join("dist"), path.join("dist_backup"), (_) => logger.info(_));

					return resolve({ msg, content });
				});
			});

			const { msg, content } = obj;

			await new Promise((resolve, reject) => {
				exec("npm run build", async (err, tscOutput) => {
					if (err) {
						fs.rename(path.join("dist_backup"), path.join("dist"), (_) => logger.info(_));
						reject(err.message);
					}
					return resolve(msg.edit(`${content}\n**Compile finished**\n${await codeblock(trim(tscOutput, 200))}`));
				});
			});
		}
		catch (err) {
			throw new Error("An error occurred during update. Please update manually\n```<GITLAB LINK TO GUIDE HERE.>```xl\n" + err.message || err);
			// TODO: add link to update.md on gitlab
		}
	}
}
