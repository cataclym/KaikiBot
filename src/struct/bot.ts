import chalk from "chalk";
import { execSync } from "child_process";
import logger from "loglevel";
import KaikiAkairoClient from "../lib/Kaiki/KaikiAkairoClient";
import fs from "fs/promises";

export class Bot {
    private readonly client: KaikiAkairoClient;
    constructor(client: KaikiAkairoClient) {
    	this.client = client;

        if (!process.env) {
            throw new Error("Missing .env file. Please double-check the guide! (https://gitlab.com/cataclym/KaikiDeishuBot/-/blob/master/GUIDE.md)");
        }

        if (!process.env.PREFIX || process.env.PREFIX === "[YOUR_PREFIX]") {
            throw new Error("Missing prefix! Set a prefix in .env");
        }

        if (!process.env.KAWAIIKEY || process.env.KAWAIIKEY === "[YOUR_OPTIONAL_KAWAII_KEY]") {
            ["run", "peek", "pout", "lick"].forEach(c => this.client.commandHandler.remove(this.client.commandHandler.findCommand(c).id));
            logger.warn("Kawaii API dependant commands have been disabled. Provide a token in .env to re-enable.");
        }

        try {
            execSync("hash neofetch");
        }
        catch {
            this.client.commandHandler.remove(this.client.commandHandler.findCommand("neofetch").id);
            logger.warn("Neofetch wasn't detected! Neofetch command will be disabled.");
        }

        this.loadPackageJSON()
            .then(() => logger.info("Package loaded!"));

        this.client.login(process.env.CLIENT_TOKEN)
            .then(() => {
                if (this.client.user) {
                    logger.info(`Logged in as ${chalk.greenBright(this.client.user.tag)}!`);
                }
            });
    }
    private async loadPackageJSON() {
        this.client.package = await fs.readFile(process.env.npm_package_json!)
            .then(file => JSON.parse(file.toString()));
    }
}
