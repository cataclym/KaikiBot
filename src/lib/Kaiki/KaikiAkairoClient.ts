import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo";
import { Snowflake } from "discord-api-types";
import { Intents, User } from "discord.js";
import logger from "loglevel";
import { join } from "path";
import { MoneyService } from "../money/MoneyService";
import MySQLProvider from "../../struct/db/MySQLProvider";
import { PrismaClient } from "@prisma/client";
import Cache from "../../cache/cache";
import Utility from "../Utility";
import { resetDailyClaims } from "../functions";
import AnniversaryRolesService from "../AnniversaryRolesService";
import Database from "../../struct/db/Database";
import chalk from "chalk/index";
import { Migrations } from "Migrations/Migrations";
import { Connection } from "mysql2/promise";
import IPackageJSON from "Interfaces/IPackageJSON";

export default class KaikiAkairoClient extends AkairoClient {
    public anniversaryService: AnniversaryRolesService;
    public botSettingsProvider: MySQLProvider;
    public cache: Cache;
    public commandHandler: CommandHandler;
    public connection: Connection;
    public dadBotChannelsProvider: MySQLProvider;
    public guildProvider: MySQLProvider;
    public inhibitorHandler: InhibitorHandler;
    public listenerHandler: ListenerHandler;
    public money: MoneyService;
    public orm: PrismaClient;
    public db: Database;
    public owner: User;
    public package: IPackageJSON;

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

    private async dailyResetTimer(client: KaikiAkairoClient): Promise<void> {
        setTimeout(async () => {

            // Loop this
            await this.dailyResetTimer(client);

            // Reset daily currency claims
            await resetDailyClaims(client.orm);

            // Check for "birthdays"
            await this.anniversaryService.birthdayService();

        }, Utility.timeToMidnight());
    }

    public async initializeServices(client?: KaikiAkairoClient) {

        if (!client) client = this;

        const ownerId = Array.isArray(client.ownerID)
            ? client.ownerID[0]
            : client.ownerID;

        this.owner = Array.isArray(client.application?.owner)
            ? client.application?.owner[0]
            : client.application?.owner;

        if (!this.owner) {
            this.owner = (client.users.cache.get(ownerId) || await client.users.fetch(ownerId, { cache: true }));
        }

        this.anniversaryService = new AnniversaryRolesService(client);

        // This will execute at midnight
        await this.dailyResetTimer(client);

        await this.anniversaryService.birthdayService();
        logger.info("birthdayService | Service initiated");
    }

    private initializeDatabase() {
        this.db = new Database();

        this.db.init()
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
                    .then((res: number) => {
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
