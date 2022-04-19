import chalk from "chalk";
import { execSync } from "child_process";
import { MessageEmbed } from "discord.js";
import fs from "fs/promises";
import logger from "loglevel";
import KaikiAkairoClient from "../lib/Kaiki/KaikiAkairoClient";
import MongoDb from "../lib/Migrations/MongoDb";

export default class Bot {
    private readonly client: KaikiAkairoClient;
    private mongoDb: MongoDb;

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
            .then(() => {
                logger.info("Package loaded!");
                if (this.client.package.optionalDependencies["mongoose"]) {
                    this.mongoDb = new MongoDb();
                }
            });


        this.client.login(process.env.CLIENT_TOKEN)
            .then(async () => {
                if (this.client.user) {
                    logger.info(`Logged in as ${chalk.greenBright(this.client.user.tag)}!`);
                }

                await this.client.application?.fetch();

                this.client.owner = Array.isArray(this.client.application?.owner)
                    ? this.client.application?.owner[0]
                    : this.client.application?.owner;

                if (!this.client.owner) {
                    logger.error("No owner found! Double check your bot application in Discord's developer panel.");
                    process.exit(1);
                }

                this.client.ownerID = this.client.owner.id;

                // Let bot owner know when bot goes online.
                if (this.client.user && ["Tsukihi Araragi#3589", "Kaiki Deishū#9185"].includes(this.client.user.tag)) {
                    // Inconspicuous emotes haha
                    const emoji = ["✨", "♥️", "✅", "🇹🇼"][Math.floor(Math.random() * 4)];
                    await this.client.owner.send({
                        embeds:
                            [new MessageEmbed()
                                .setTitle(emoji)
                                .setDescription("Bot is online!")
                                .withOkColor(),
                            ],
                    });
                }
            });
    }

    private async loadPackageJSON() {
        this.client.package = await fs.readFile(process.env.npm_package_json!)
            .then(file => JSON.parse(file.toString()));
    }
}
