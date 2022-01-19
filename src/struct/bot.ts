import chalk from "chalk";
import { execSync } from "child_process";
import { inject, injectable } from "inversify";
import logger from "loglevel";
import MongoDb from "./db/mongoDb";
import { KaikiClient } from "./kaikiClient";
import { TYPES } from "./types";

@injectable()
export class Bot {
    private _client: KaikiClient;
    private readonly _token: string;
    constructor(
        @inject(TYPES.Client) client: KaikiClient,
        @inject(TYPES.Token) token: string,
    ) {

    	this._client = client;
    	this._token = token;

        if (!process.env.PREFIX || process.env.PREFIX === "[YOUR_PREFIX]") {
            throw new Error("Missing prefix! Set a prefix in .env");
        }

        void this.verifyOwnerId();

        if (!process.env.KAWAIIKEY || process.env.KAWAIIKEY === "[YOUR_OPTIONAL_KAWAII_KEY]") {
            ["run", "peek", "pout", "lick"].forEach(c => this._client.commandHandler.deregister(this._client.commandHandler.findCommand(c)));
            logger.warn("Kawaii API dependant commands have been disabled. Provide a token in .env to re-enable.");
        }

        try {
            execSync("hash neofetch");
        }
        catch {
            this._client.commandHandler.deregister(this._client.commandHandler.findCommand("neofetch"));
            logger.warn("Neofetch wasn't detected! Neofetch command will be disabled.");
        }

        // TODO: Remove this!
        void new MongoDb().init();

        this._client.login(this._token).then(() => {
            if (this._client.user) {
                logger.info(`Logged in as ${chalk.greenBright(this._client.user.tag)}!`);
            }
        });
    }

    private async verifyOwnerId() {
        if (!process.env.OWNER || process.env.OWNER === "[YOUR_OWNER_ID]" || !(await this._client.users.fetch(process.env.OWNER, { cache: true }))) {
            throw new Error("Missing owner-ID! Please double-check the guide and set an owner in .env");
        }
    }
}
