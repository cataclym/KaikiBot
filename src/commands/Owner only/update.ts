import { exec } from "child_process";
import { Message } from "discord.js";
import fs from "fs";
import logger from "loglevel";
import * as path from "path";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import Utility from "../../lib/Utility";

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

            const obj: { msg: Message, content: string } = await new Promise((resolve) => {
                exec("git describe --tags", async (err, stdv) => {
                    if (err) {
                        throw new Error(err.message);
                    }
                    const content = `Log:\n${await Utility.codeblock(Utility.trim(std, 1000))}\nUpdated ${message.client.user?.tag} to ${stdv}`;
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
                    return resolve(msg.edit(`${content}\n**Compile finished**\n${await Utility.codeblock(Utility.trim(tscOutput, 200))}`));
                });
            });
        }
        catch {
            throw new Error("An error occurred during update. Please update manually\nhttps://gitlab.com/cataclym/KaikiDeishuBot/-/tree/master/docs/UPDATE.md");
        }
    }
}
