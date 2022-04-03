import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo";
import { Intents, User } from "discord.js";
import logger from "loglevel";
import { Connection } from "mysql2/promise";
import { join } from "path";
import KaikiCache from "../../cache/KaikiCache";
import Database from "../../struct/db/Database";
import MySQLProvider from "../../struct/db/MySQLProvider";
import AnniversaryRolesService from "../AnniversaryRolesService";
import { resetDailyClaims } from "../functions";
import IPackageJSON from "../Interfaces/IPackageJSON";
import { MoneyService } from "../money/MoneyService";
import Utility from "../Utility";
import KaikiCommandHandler from "./KaikiCommandHandler";

export default class KaikiAkairoClient extends AkairoClient {
    public anniversaryService: AnniversaryRolesService;
    public botSettings: MySQLProvider;
    public cache: KaikiCache;
    public commandHandler: CommandHandler;
    public connection: Connection;
    public dadBotChannels: MySQLProvider;
    public guildsDb: MySQLProvider;
    public inhibitorHandler: InhibitorHandler;
    public listenerHandler: ListenerHandler;
    public money: MoneyService;
    public orm: PrismaClient;
    public db: Database;
    public owner: User;
    public package: IPackageJSON;

    constructor() {
        super({
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

        this.commandHandler = new KaikiCommandHandler(this, {
            allowMention: true,
            automateCategories: true,
            blockBots: true,
            blockClient: true,
            commandUtil: true,
            defaultCooldown: 2500,
            directory: join(__dirname, "../../commands"),
            fetchMembers: true,
            handleEdits: false,
            prefix: message => {
                if (message.guild) {
                    return this.guildsDb.get(message.guild.id, "Prefix", process.env.PREFIX);
                }
                return String(process.env.PREFIX);
            },
        });

        this.listenerHandler = new ListenerHandler(this, { directory: join(__dirname, "../../listeners") });
        this.inhibitorHandler = new InhibitorHandler(this, { directory: join(__dirname, "../../inhibitors") });

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

        this.anniversaryService = new AnniversaryRolesService(client);

        // This will execute at midnight
        await this.dailyResetTimer(client);
        logger.info("birthdayService | Service initiated");
    }

    private initializeDatabase() {
        this.db = new Database();

        this.db.init()
            .then((obj) => {
                this.orm = obj.orm;
                this.connection = obj.connection;

                this.botSettings = new MySQLProvider(this.connection, "BotSettings", { idColumn: "Id" });
                this.botSettings.init().then(() => logger.info(`SQL BotSettings provider - ${chalk.green("READY")}`));

                this.guildsDb = new MySQLProvider(this.connection, "Guilds", { idColumn: "Id" });
                this.guildsDb.init().then(() => logger.info(`SQL Guild provider - ${chalk.green("READY")}`));

                this.cache = new KaikiCache(this.orm, this.connection);
                void this.cache.init();
                this.money = new MoneyService(this.orm);
            });
    }
}
