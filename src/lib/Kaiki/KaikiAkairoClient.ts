import { type PrismaClient } from "@prisma/client";
import chalk from "chalk";
import { execSync } from "child_process";
import { AkairoClient, CommandHandler, CommandHandlerOptions, InhibitorHandler, ListenerHandler } from "discord-akairo";
import { GatewayIntentBits, Guild, Partials, User } from "discord.js";
import logger from "loglevel";
import { Pool } from "mysql2/promise";
import { join } from "path";
import KaikiCache from "../../cache/KaikiCache";
import Constants from "../../struct/Constants";
import Database from "../../struct/db/Database";
import DatabaseProvider from "../../struct/db/DatabaseProvider";
import AnniversaryRolesService from "../AnniversaryRolesService";
import HentaiService from "../Hentai/HentaiService";
import PackageJSON from "../Interfaces/PackageJSON";
import { MoneyService } from "../Money/MoneyService";
import Utility from "../Utility";
import KaikiCommandHandler from "./KaikiCommandHandler";

export default class KaikiAkairoClient<Ready extends true> extends AkairoClient<Ready> {

    public anniversaryService: AnniversaryRolesService;
    public botSettings: DatabaseProvider;
    public cache: KaikiCache;
    public connection: () => Pool;
    public dadBotChannels: DatabaseProvider;
    public guildsDb: DatabaseProvider;
    public readonly commandHandler: CommandHandler;
    public readonly inhibitorHandler: InhibitorHandler;
    public readonly listenerHandler: ListenerHandler;
    public money: MoneyService;
    public orm: PrismaClient;
    public db: Database;
    public owner: User;
    public package: PackageJSON;
    public hentaiService: HentaiService;
    private readonly filterArray: string[];

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
            partials: [Partials.Reaction, Partials.Channel, Partials.GuildMember],
            shards: "auto",
        });

        this.initializeDatabase();

        // Load command paths into filter if KawaiiAPI key is missing.
        this.filterArray = [];
        if (!process.env.KAWAIIKEY || process.env.KAWAIIKEY === "[YOUR_OPTIONAL_KAWAII_KEY]") {
            const dir = join(__dirname, "..", "..", "commands", "Interactions");
            this.filterArray.push(`${dir}/run.js`, `${dir}/peek.js`, `${dir}/pout.js`, `${dir}/lick.js`);
        }

        // Check if 'neofetch' is available
        try {
            execSync("command -v neofetch >/dev/null 2>&1");
        }
        catch {
            this.filterArray.push(join(__dirname, "..", "..", "commands", "Fun", "neofetch.js"));
            logger.warn("Neofetch wasn't detected! Neofetch command will be disabled.");
        }

        this.commandHandler = new KaikiCommandHandler(this, this.commandHandlerOptions);
        this.listenerHandler = new ListenerHandler(this, { directory: join(__dirname, "../../listeners") });
        this.inhibitorHandler = new InhibitorHandler(this, { directory: join(__dirname, "../../inhibitors") });

        this.listenerHandler.setEmitters({ commandHandler: this.commandHandler });

        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

        void this.inhibitorHandler.loadAll();
        void this.listenerHandler.loadAll();
        void this.commandHandler.loadAll();

    }

    private async dailyResetTimer(client: KaikiAkairoClient<true>): Promise<void> {
        setTimeout(async () => {

            // Loop this
            await this.dailyResetTimer(client);

            // Reset daily currency claims
            await this.resetDailyClaims();

            // Check for "birthdays"
            await this.anniversaryService.birthdayService();

        }, Utility.timeToMidnight());
    }

    public async initializeServices(client?: KaikiAkairoClient<Ready>) {

        if (!client) client = this;

        this.anniversaryService = new AnniversaryRolesService(client);

        // This will execute at midnight
        await this.dailyResetTimer(client);
        logger.info("AnniversaryRolesService | Service initiated");

        this.hentaiService = new HentaiService();
        logger.info("HentaiService | Service initiated");

        void this.presenceLoop();
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
                this.money = new MoneyService(this.orm);
            });
    }

    private async presenceLoop(): Promise<NodeJS.Timer> {
        await this.setPresence();

        return setInterval(((scope: KaikiAkairoClient<Ready>) => {
            return async () => {
                await scope.setPresence();
            };
        })(this), Constants.MAGIC_NUMBERS.LIB.KAIKI.PRESENCE_UPDATE_TIMEOUT);
    }

    public async setPresence() {
        const db = await this.orm.botSettings.findFirst();

        if (db && db.Activity && db.ActivityType) {

            const acType = Constants.ActivityTypes[db.ActivityType];

            this.user.setPresence({
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
        logger.info(`ResetDailyClaims | Daily claims have been reset! Updated ${chalk.green(updated.count)} entries!`);
    }

    private commandHandlerOptions: CommandHandlerOptions = {
        allowMention: true,
        automateCategories: true,
        blockBots: true,
        blockClient: true,
        commandUtil: true,
        defaultCooldown: 1000,
        directory: join(__dirname, "../../commands"),
        fetchMembers: true,
        handleEdits: false,
        loadFilter: (module) => {
            return !this.filterArray.includes(module);
        },
        prefix: ({ guild }: { guild: Guild | null }) => {
            if (!guild) {
                return String(process.env.PREFIX);
            }
            return String(this.guildsDb.get(guild.id, "Prefix", process.env.PREFIX));
        },
        autoRegisterSlashCommands: true,
    };
}
