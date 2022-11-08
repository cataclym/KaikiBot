import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo";
import { ClientApplication, ClientUser, GatewayIntentBits, Guild, Partials, User } from "discord.js";
import logger from "loglevel";
import { Pool } from "mysql2/promise";
import { join } from "path";
import KaikiCache from "../../cache/KaikiCache";
import Database from "../../struct/db/Database";
import DatabaseProvider from "../../struct/db/DatabaseProvider";
import AnniversaryRolesService from "../AnniversaryRolesService";
import { resetDailyClaims } from "../functions";
import IPackageJSON from "../Interfaces/IPackageJSON";
import { MoneyService } from "../Money/MoneyService";
import Utility from "../Utility";
import KaikiCommandHandler from "./KaikiCommandHandler";

export default class KaikiAkairoClient<Ready extends boolean = boolean> extends AkairoClient {

    // The following was added to avoid errors with discord.js v14.x -->
    get readyAt(): Date {
        return super.readyAt || new Date();
    }

    public readyTimestamp: number;
    token: string;

    get uptime(): number {
        return super.uptime || 0;
    }

    user: ClientUser;
    // <--

    public anniversaryService: AnniversaryRolesService;
    public application: ClientApplication;
    public botSettings: DatabaseProvider;
    public cache: KaikiCache;
    public commandHandler: CommandHandler;
    public connection: () => Pool;
    public dadBotChannels: DatabaseProvider;
    public guildsDb: DatabaseProvider;
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
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
            ],
            partials: [Partials.Reaction, Partials.Channel],
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
            defaultCooldown: 1000,
            directory: join(__dirname, "../../commands"),
            fetchMembers: true,
            handleEdits: false,
            prefix: ({ guild }: { guild: Guild | null }) => {
                if (!guild) {
                    return String(process.env.PREFIX);
                }
                return String(this.guildsDb.get(guild.id, "Prefix", process.env.PREFIX));
            },
            autoRegisterSlashCommands: true,
        });

        this.listenerHandler = new ListenerHandler(this, { directory: join(__dirname, "../../listeners") });
        this.inhibitorHandler = new InhibitorHandler(this, { directory: join(__dirname, "../../inhibitors") });

        this.listenerHandler.setEmitters({ commandHandler: this.commandHandler });

        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

        void this.inhibitorHandler.loadAll();
        void this.listenerHandler.loadAll();
        void this.commandHandler.loadAll();
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
        this.db = new Database(this);

        this.db.init()
            .then((obj) => {
                this.orm = obj.orm;
                this.connection = () => obj.mySQLConnection;

                this.botSettings = new DatabaseProvider(this.connection, "BotSettings", { idColumn: "Id" }, false);
                this.botSettings.init().then(() => logger.info(`${chalk.green("READY")} - Bot settings provider`));

                this.guildsDb = new DatabaseProvider(this.connection, "Guilds", { idColumn: "Id" });
                this.guildsDb.init().then(() => logger.info(`${chalk.green("READY")} - Guild provider`));

                this.dadBotChannels = new DatabaseProvider(this.connection, "DadBotChannels", { idColumn: "ChannelId" });
                this.dadBotChannels.init().then(() => logger.info(`${chalk.green("READY")} - DadBot channel provider`));

                this.cache = new KaikiCache(this.orm, this.connection);
                void this.cache.init();

                this.money = new MoneyService(this.orm);
            });
    }
}
