import chalk from "chalk";
import { execSync } from "child_process";
import logger from "loglevel";
import MongoDb from "./db/mongoDb";
import { KaikiClient } from "kaiki";

export class Bot {
    public client: KaikiClient;
    constructor(client: KaikiClient) {
    	this.client = client;

        if (!process.env.PREFIX || process.env.PREFIX === "[YOUR_PREFIX]") {
            throw new Error("Missing prefix! Set a prefix in .env");
        }

        void this.verifyOwnerId();

        if (!process.env.KAWAIIKEY || process.env.KAWAIIKEY === "[YOUR_OPTIONAL_KAWAII_KEY]") {
            ["run", "peek", "pout", "lick"].forEach(c => this.client.commandHandler.deregister(this.client.commandHandler.findCommand(c)));
            logger.warn("Kawaii API dependant commands have been disabled. Provide a token in .env to re-enable.");
        }

        try {
            execSync("hash neofetch");
        }
        catch {
            this.client.commandHandler.deregister(this.client.commandHandler.findCommand("neofetch"));
            logger.warn("Neofetch wasn't detected! Neofetch command will be disabled.");
        }

        // TODO: Remove this!
        void new MongoDb().init();

        this.client.login(process.env.CLIENT_TOKEN)
            .then(() => {
                if (this.client.user) {
                    logger.info(`Logged in as ${chalk.greenBright(this.client.user.tag)}!`);
                }
            });
    }

    private async verifyOwnerId() {
        if (!process.env.OWNER || process.env.OWNER === "[YOUR_OWNER_ID]" || !(await this.client.users.fetch(process.env.OWNER, { cache: true }))) {
            throw new Error("Missing owner-ID! Please double-check the guide and set an owner in .env");
        }
    }
}
