import { execSync } from "child_process";
import process from "process";
import { type PrismaClient } from "@prisma/client";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import * as colorette from "colorette";
import {
    EmbedBuilder,
    GatewayIntentBits,
    Guild,
    Partials,
    Team,
    User,
} from "discord.js";
import { Pool } from "mysql2/promise";
import KaikiCache from "../Cache/KaikiCache";
import Constants from "../../struct/Constants";
import Database from "../../struct/db/Database";
import DatabaseProvider from "../../struct/db/DatabaseProvider";
import AnniversaryRolesService from "../AnniversaryRolesService";
import type { ClientImageAPIs } from "../APIs/Common/Types";
import KawaiiAPI from "../APIs/KawaiiAPI";
import NekosLife from "../APIs/nekos.life";
import NekosAPI from "../APIs/NekosAPI";
import PurrBot from "../APIs/PurrBot";
import WaifuIm from "../APIs/waifu.im";
import WaifuPics from "../APIs/WaifuPics";
import HentaiService from "../Hentai/HentaiService";
import type PackageJSON from "../Interfaces/Common/PackageJSON";
import KaikiUtil from "../KaikiUtil";
import { MoneyService } from "../Money/MoneyService";
import KaikiClientInterface from "./KaikiClientInterface";
import fs from "fs/promises";
import { container } from "@sapphire/pieces";
import { createDjsClient } from "discordbotlist-djs";
import NeofetchCommand from "../../commands/Fun/neofetch";

export default class KaikiSapphireClient<Ready extends true>
    extends SapphireClient<Ready>
    implements KaikiClientInterface
{
    public anniversaryService: AnniversaryRolesService;
    public botSettings: DatabaseProvider;
    public cache: KaikiCache;
    public connection: Pool;
    public dadBotChannels: DatabaseProvider;
    public guildsDb: DatabaseProvider;
    public money: MoneyService;
    public orm: PrismaClient;
    public db: Database;
    public owner: User;
    public package: PackageJSON;
    public hentaiService: HentaiService;

    constructor() {
        super({
            allowedMentions: { parse: ["users"], repliedUser: true },
            intents: [
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
            ],
            partials: [
                Partials.Reaction,
                Partials.Channel,
                Partials.GuildMember,
            ],
            shards: "auto",
            loadMessageCommandListeners: true,
            loadDefaultErrorListeners: true,
            defaultCooldown: {
                delay: 1000,
            },
            defaultPrefix: process.env.PREFIX,
            caseInsensitiveCommands: true,
            logger: {
                level: LogLevel.Debug,
            },
            typing: true,
        });

        (async () => await this.initializeDatabase())().catch((e) => {
            throw new Error(e);
        });

        if (!process.env) {
            throw new Error(
                `Missing .env file. Please double-check the guide! (${Constants.LINKS.GUIDE})`
            );
        }

        if (!process.env.PREFIX || process.env.PREFIX === "[YOUR_PREFIX]") {
            throw new Error("Missing prefix! Set a prefix in .env");
        }

        if (!process.env.DATABASE_URL) {
            throw new Error("Missing DATABASE_URL! Set a valid url in .env");
        }

        void this.loadPackageJSON();

        // Not using logger here. Because it resets multiline color
        console.log(colorette.green(Constants.KaikiBotASCII));

        super.login(process.env.CLIENT_TOKEN).then(async () => this.init(this));
    }

    private async init(client: this) {
        if (!client.user) {
            throw new Error("Missing bot client user!");
        }

        if (
            process.env.DBL_API_TOKEN &&
			process.env.NODE_ENV === "production"
        ) {
            this.dblService();
        }
        await client.application?.fetch();

        if (!client.application?.owner) {
            return KaikiSapphireClient.noBotOwner();
        }

        const owner =
			client.application.owner instanceof Team
			    ? client.application.owner.owner?.user
			    : client.application.owner;

        if (!owner) {
            return KaikiSapphireClient.noBotOwner();
        } else {
            client.owner = owner;
        }

        client.logger.info(
            `Bot account: ${colorette.greenBright(client.user.username)}`
        );
        client.logger.info(
            `Bot owner: ${colorette.greenBright(client.owner.username)}`
        );

        // Let bot owner know when bot goes online.
        if (client.user && client.owner.id === process.env.OWNER) {
            // Inconspicuous emotes haha
            const emoji = ["✨", "♥️", "✅", "🇹🇼"][
                Math.floor(Math.random() * 4)
            ];
            await client.owner.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(emoji)
                        .setDescription("Bot is online!")
                        .setFooter({
                            text: `${client.package.name} - v${client.package.version}`,
                        })
                        .withOkColor(),
                ],
            });
        }

        await client.filterOptionalCommands();
    }

    private static noBotOwner(): never {
        container.logger.error(
            "No bot owner found! Double check your bot application in Discord's developer panel."
        );
        process.exit(1);
    }

    private async loadPackageJSON() {
        if (!process.env.npm_package_json) {
            this.package = await fs
                .readFile("package.json")
                .then((file) => JSON.parse(file.toString()));
        } else {
            this.package = await fs
                .readFile(process.env.npm_package_json)
                .then((file) => JSON.parse(file.toString()));
        }
    }

    public imageAPIs: ClientImageAPIs = {
        KawaiiAPI: new KawaiiAPI(),
        NekosAPI: new NekosAPI(),
        NekosLife: new NekosLife(),
        PurrBot: new PurrBot(),
        WaifuIm: new WaifuIm(),
        WaifuPics: new WaifuPics(),
    };

    public fetchPrefix = async ({ guild }: { guild: Guild | null }) => {
        if (!guild) {
            return String(process.env.PREFIX);
        }
        return String(
            this.guildsDb.get(guild.id, "Prefix", process.env.PREFIX)
        );
    };

    private async dailyResetTimer(): Promise<void> {
        setTimeout(async () => {
            // Loop this
            await this.dailyResetTimer();

            // Check for "birthdays"
            await this.anniversaryService.birthdayService();
        }, KaikiUtil.timeToMidnight());
    }

    private async resetTimer(): Promise<void> {
        setTimeout(async () => {
            // Loop this
            await this.resetTimer();

            // Reset daily currency claims
            await this.resetDailyClaims();
        }, KaikiUtil.timeToMidnightOrNoon());
    }

    public async initializeServices() {
        this.anniversaryService = new AnniversaryRolesService(this);

        // This will execute at midnight
        await Promise.all([this.dailyResetTimer(), this.resetTimer()]);
        this.logger.info("AnniversaryRolesService | Service initiated");

        this.hentaiService = new HentaiService();
        this.logger.info("HentaiService | Service initiated");

        void this.presenceLoop();
    }

    private async initializeDatabase() {
        this.db = new Database(this);

        const database = await this.db.init();

        this.orm = database.orm;
        this.connection = database.mySQLConnection;

        this.botSettings = new DatabaseProvider(
            this.connection,
            "BotSettings",
            { idColumn: "Id" },
            false
        );
        this.botSettings
            .init()
            .then(() =>
                this.logger.info(
                    `${colorette.green("READY")} - Bot settings provider`
                )
            )
            .catch((e) => this.dbRejected(e));

        this.guildsDb = new DatabaseProvider(this.connection, "Guilds", {
            idColumn: "Id",
        });
        this.guildsDb
            .init()
            .then(() =>
                this.logger.info(`${colorette.green("READY")} - Guild provider`)
            )
            .catch((e) => this.dbRejected(e));

        this.dadBotChannels = new DatabaseProvider(
            this.connection,
            "DadBotChannels",
            { idColumn: "ChannelId" }
        );
        this.dadBotChannels
            .init()
            .then(() =>
                this.logger.info(
                    `${colorette.green("READY")} - DadBot channel provider`
                )
            )
            .catch((e) => this.dbRejected(e));

        this.cache = new KaikiCache(this.orm, this.connection, this.imageAPIs);
        this.money = new MoneyService(this.orm);
    }

    private async presenceLoop(): Promise<NodeJS.Timer> {
        await this.setPresence();

        return setInterval(
            ((scope: KaikiSapphireClient<true>) => {
                return async () => {
                    await scope.setPresence();
                };
            })(this),
            Constants.MAGIC_NUMBERS.LIB.KAIKI.PRESENCE_UPDATE_TIMEOUT
        );
    }

    public async setPresence() {
        const db = await this.orm.botSettings.findFirst();

        if (db && db.Activity && db.ActivityType) {
            const acType = Constants.activityTypes[db.ActivityType];

            this.user?.setPresence({
                activities: [
                    {
                        name: db.Activity,
                        type: acType,
                    },
                ],
            });
        }
    }

    public async resetDailyClaims(): Promise<void> {
        const updated = await this.orm.discordUsers.updateMany({
            where: {
                ClaimedDaily: true,
            },
            data: {
                ClaimedDaily: false,
            },
        });
        this.logger.info(
            `ResetDailyClaims | Daily claims have been reset! Updated ${colorette.green(updated.count)} entries!`
        );
    }

    async filterOptionalCommands() {
        const commandStore = this.stores.get("commands");

        if (!process.env.KAWAIIKEY || process.env.KAWAIIKEY === "[YOUR_OPTIONAL_KAWAII_KEY]") {
            for (const entry of ["run", "peek", "pout", "lick"]) {
                await commandStore.unload(entry);
            }
            this.logger.warn(
                "No Kawaii key provided. Kawaii API commands will be disabled."
            );
        }

        // Check if 'neofetch/fastfetch' is available
        try {
            execSync("command -v fastfetch >/dev/null 2>&1");
        } catch {
            try {
                execSync("command -v neofetch >/dev/null 2>&1");
            } catch {
                await commandStore.unload("neofetch");
                this.logger.warn("Neofetch or fastfetch wasn't detected! Neofetch command will be disabled.");
            }
            NeofetchCommand.usingFastFetch = false;
        }
    }

    private dbRejected(e: unknown) {
        this.logger.fatal("Failed to connect to database using MySQL2.", e);
        process.exit(1);
    }

    private dblService() {
        const client = createDjsClient(process.env.DBL_API_TOKEN!, this);

        client.startPosting();
        client.startPolling();

        client.on("vote", async (vote) => {
            const amount = this.botSettings.get("1", "DailyAmount", 250);
            await Promise.all([
                this.users.cache
                    .get(vote.id)
                    ?.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Thank you for your support! 🎉")
                                .setDescription(
                                    `You received ${amount} ${this.money.currencyName} ${this.money.currencySymbol}`
                                )
                                .setFooter({
                                    text: "🧡",
                                })
                                .setColor(Constants.kaikiOrange),
                        ],
                    })
                // Ignore failed DMs
                    .catch(() => undefined),
                this.money.add(
                    vote.id,
                    BigInt(amount),
                    "Voted - DiscordBotList"
                ),
            ]);
        });
    }
}
