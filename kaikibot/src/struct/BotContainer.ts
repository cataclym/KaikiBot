import fs from "fs/promises";
import process from "process";
import { container } from "@sapphire/pieces";
import * as colorette from "colorette";
import { EmbedBuilder, Team } from "discord.js";
import type KaikiSapphireClient from "../lib/Kaiki/KaikiSapphireClient";
import Constants from "./Constants";

export default class BotContainer {
    private readonly client: KaikiSapphireClient<true>;

    constructor(client: KaikiSapphireClient<true>) {
        this.client = client;

        if (!process.env) {
            throw new Error(`Missing .env file. Please double-check the guide! (${Constants.LINKS.GUIDE})`);
        }

        if (!process.env.PREFIX || process.env.PREFIX === "[YOUR_PREFIX]") {
            throw new Error("Missing prefix! Set a prefix in .env");
        }

        if (!process.env.DATABASE_URL) {
            throw new Error("Missing DATABASE_URL! Set a valid url in .env");
        }

        void this.loadPackageJSON();
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

    private static noBotOwner(): never {
        container.logger.error("No bot owner found! Double check your bot application in Discord's developer panel.");
        process.exit(1);
    }

    public async init() {
        this.client.login(process.env.CLIENT_TOKEN)
            .then(async () => {
                if (!this.client.user) {
                    throw new Error("Missing bot client user!");
                }

                await this.client.application?.fetch();

                if (!this.client.application?.owner) {
                    return BotContainer.noBotOwner();
                }

                const owner = this.client.application.owner instanceof Team
                    ? this.client.application.owner.owner?.user
                    : this.client.application.owner;

                if (!owner) {
                    return BotContainer.noBotOwner();
                }

                else {
                    this.client.owner = owner;
                }

                this.client.logger.info(`Bot account: ${colorette.greenBright(this.client.user.username)}`);
                this.client.logger.info(`Bot owner: ${colorette.greenBright(this.client.owner.username)}`);

                // Let bot owner know when bot goes online.
                if (this.client.user && this.client.owner.id === process.env.OWNER) {
                    // Inconspicuous emotes haha
                    const emoji = ["✨", "♥️", "✅", "🇹🇼"][Math.floor(Math.random() * 4)];
                    await this.client.owner.send({
                        embeds:
                            [
                                new EmbedBuilder()
                                    .setTitle(emoji)
                                    .setDescription("Bot is online!")
                                    .setFooter({
                                        text: `${this.client.package.name} - v${this.client.package.version}`,
                                    })
                                    .withOkColor(),
                            ],
                    });
                }

                await this.client.filterOptionalCommands();
            })
            .catch(e => {
                container.logger.warn(e);
                process.exit(1);
            });
    }
}
