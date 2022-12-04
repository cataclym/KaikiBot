import chalk from "chalk";
import { EmbedBuilder, Team } from "discord.js";
import fs from "fs/promises";
import logger from "loglevel";
import KaikiAkairoClient from "../lib/Kaiki/KaikiAkairoClient";

export default class Bot {
    private readonly client: KaikiAkairoClient;

    constructor(client: KaikiAkairoClient) {
        this.client = client;

        if (!process.env) {
            throw new Error("Missing .env file. Please double-check the guide! (https://gitlab.com/cataclym/KaikiDeishuBot/-/blob/master/GUIDE.md)");
        }

        if (!process.env.PREFIX || process.env.PREFIX === "[YOUR_PREFIX]") {
            throw new Error("Missing prefix! Set a prefix in .env");
        }

        if (!process.env.DATABASE_URL) {
            throw new Error("Missing DATABASE_URL! Set a valid url in .env");
        }

        if (!process.env.KAWAIIKEY || process.env.KAWAIIKEY === "[YOUR_OPTIONAL_KAWAII_KEY]") {
            logger.warn("Kawaii API dependant commands have been disabled. Provide a token in .env to re-enable.");
        }

        void this.loadPackageJSON();

        this.client.login(process.env.CLIENT_TOKEN)
            .then(async () => {
                if (!this.client.user) {
                    throw new Error("Missing bot client user!");
                }

                await this.client.application?.fetch();

                if (!this.client.application?.owner) {
                    return Bot.noBotOwner();
                }

                const owner = this.client.application.owner instanceof Team
                    ? this.client.application.owner.owner?.user
                    : this.client.application.owner;

                if (!owner) {
                    return Bot.noBotOwner();
                }

                else {
                    this.client.owner = owner;
                }

                this.client.ownerID = this.client.owner.id;

                logger.info(`Bot account: ${chalk.greenBright(this.client.user.tag)}`);
                logger.info(`Bot owner: ${chalk.greenBright(this.client.owner.tag)}`);

                // Let bot owner know when bot goes online.
                if (this.client.user && ["Tsukihi Araragi#3589", "Kaiki Deishū#9185"].includes(this.client.user.tag)) {
                    // Inconspicuous emotes haha
                    const emoji = ["✨", "♥️", "✅", "🇹🇼"][Math.floor(Math.random() * 4)];
                    await this.client.owner.send({
                        embeds:
                            [
                                new EmbedBuilder()
                                    .setTitle(emoji)
                                    .setDescription("Bot is online!")
                                    .withOkColor(),
                            ],
                    });
                }
            });
    }

    private async loadPackageJSON() {
        if (!process.env.npm_package_json) {
            this.client.package = await fs.readFile("package.json")
                .then(file => JSON.parse(file.toString()));
        }

        else {
            this.client.package = await fs.readFile(process.env.npm_package_json)
                .then(file => JSON.parse(file.toString()));
        }
    }

    private static noBotOwner() {
        logger.error("No bot owner found! Double check your bot application in Discord's developer panel.");
        process.exit(1);
    }
}
