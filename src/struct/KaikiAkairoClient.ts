import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo";
import { Snowflake } from "discord-api-types";
import { Intents } from "discord.js";
import { KaikiClient as ExternalKaikiClient } from "kaiki";
import logger from "loglevel";
import { Connection as MySQLConnection } from "mysql2/promise";
import { join } from "path";
import { MoneyService } from "../lib/money/MoneyService";
import MySQLProvider from "./db/MySQLProvider";
import { PrismaClient } from "@prisma/client";
import Cache from "../cache/cache";
import Utility from "../lib/Utility";
import { resetDailyClaims } from "../lib/functions";
import AnniversaryRolesService from "../lib/AnniversaryRolesService";
import { Database } from "./db/Database";
import chalk from "chalk/index";
import { Migrations } from "../migrations/migrations";

export default class KaikiAkairoClient extends AkairoClient implements ExternalKaikiClient {
    public anniversaryService: AnniversaryRolesService;
    public botSettingsProvider: MySQLProvider;
    public cache: Cache;
    public commandHandler: CommandHandler;
    public connection: MySQLConnection;
    public guildProvider: MySQLProvider;
    public inhibitorHandler: InhibitorHandler;
    public listenerHandler: ListenerHandler;
    public money: MoneyService;
    public orm: PrismaClient;

    constructor() {
        super({
            ownerID: process.env.OWNER as Snowflake,
            allowedMentions: { parse: ["users"], repliedUser: true },
            intents: [
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
                Intents.FLAGS.GUILD_INTEGRATIONS,
                Intents.FLAGS.GUILD_INVITES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                // Intents.FLAGS.GUILD_MESSAGE_TYPING,
                Intents.FLAGS.GUILD_PRESENCES,
                // Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_WEBHOOKS,
            ],
            partials: ["REACTION", "CHANNEL"],
            shards: "auto",
            // Uncomment to have mobile status on bot.
            // ws: { properties: { $browser: "Discord Android" } },
        });

        this.initializeDatabase();

        this.commandHandler = new CommandHandler(this, {
            allowMention: true,
            automateCategories: true,
            blockBots: true,
            blockClient: true,
            commandUtil: true,
            defaultCooldown: 2500,
            directory: join(__dirname, "../commands"),
            fetchMembers: true,
            handleEdits: false,
            prefix: message => {
                if (message.guild) {
                    return this.guildProvider.get(message.guild.id, "Prefix", process.env.PREFIX);
                }
                return String(process.env.PREFIX);
            },
        });

        this.listenerHandler = new ListenerHandler(this, { directory: join(__dirname, "../listeners") });
        this.inhibitorHandler = new InhibitorHandler(this, { directory: join(__dirname, "../inhibitors") });

        this.listenerHandler.setEmitters({ commandHandler: this.commandHandler });

        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

        this.inhibitorHandler.loadAll();
        this.listenerHandler.loadAll();
        this.commandHandler.loadAll();
    }

    private async dailyResetTimer(client: KaikiClient): Promise<void> {
        setTimeout(async () => {

            // Loop this
            await this.dailyResetTimer(client);

            // Reset tinder rolls
            // resetRolls();

            // Reset daily currency claims
            await resetDailyClaims(client.orm);

            // Check for "birthdays"
            await this.anniversaryService.birthdayService();

        }, Utility.timeToMidnight());
    }

    public async initializeServices(client?: KaikiClient) {

        if (!client) client = this;

        this.anniversaryService = new AnniversaryRolesService(client);

        // This will execute at midnight
        await this.dailyResetTimer(client);

        await this.anniversaryService.birthdayService();
        logger.info("birthdayService | Service initiated");
    }

    private initializeDatabase() {
        const db = new Database();

        db.init()
            .then((obj) => {
                this.orm = obj.orm;
                this.connection = obj.connection;

                this.botSettingsProvider = new MySQLProvider(this.connection, "BotSettings", { idColumn: "Id" });
                this.botSettingsProvider.init().then(() => logger.info(`SQL BotSettings provider - ${chalk.green("READY")}`));

                this.guildProvider = new MySQLProvider(this.connection, "Guilds", { idColumn: "Id" });
                this.guildProvider.init().then(() => logger.info(`SQL Guild provider - ${chalk.green("READY")}`));

                this.cache = new Cache(this.orm, this.connection);
                void this.cache.init();
                this.money = new MoneyService(this.orm);

                void this.initializeServices;

                new Migrations(this.connection, this)
                    .runAllMigrations()
                    .then((res) => {
                        if (res) {
                            logger.info(`
    ${(chalk.greenBright)("|----------------------------------------------------------|")}
    migrationService | Migrations have successfully finished
    migrationService | Inserted ${(chalk.green)(res)} records into kaikidb
    ${(chalk.greenBright)("|----------------------------------------------------------|")}`);
                        }
                    })
                    .catch(e => {
                        throw e;
                    });
            });
    }
}
