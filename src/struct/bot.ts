import { inject, injectable } from "inversify";
import { KaikiClient } from "./kaikiClient";
import MongoDb from "./db/mongoDb";
import { TYPES } from "./types";
import logger from "loglevel";
import chalk from "chalk";

@injectable()
export class Bot {
    public client: KaikiClient;
    private readonly _token: string;
    constructor(
        @inject(TYPES.Client) client: KaikiClient,
        @inject(TYPES.Token) token: string,
    ) {

    	this.client = client;
    	this._token = token;

        if (!process.env.PREFIX || process.env.PREFIX === "[YOUR_PREFIX]") {
            throw new Error("Missing prefix! Set a prefix in .env");
        }

        if (!process.env.OWNER || process.env.OWNER === "[YOUR_OWNER_ID]") {
            throw new Error("Missing owner-ID! Please double-check the guide and set an owner in .env");
        }

        if (!process.env.KAWAIIKEY || process.env.KAWAIIKEY === "[YOUR_OPTIONAL_KAWAII_KEY]") {
            ["run", "peek", "pout", "lick"].forEach(c => this.client.commandHandler.deregister(this.client.commandHandler.findCommand(c)));
            logger.warn("Kawaii API dependant commands have been disabled. Provide a token in .env to re-enable.");
        }

        void new MongoDb().init();

        this.client.login(this._token).then(() => {
            if (this.client.user) {
                logger.info(`Logged in as ${chalk.greenBright(this.client.user.tag)}!`);
            }
        });
    }
}
