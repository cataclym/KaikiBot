import { execSync } from "child_process";
import process from "process";
import { type PrismaClient } from "@prisma/client";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import * as colorette from "colorette";
import { GatewayIntentBits, Guild, Partials, User } from "discord.js";
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

export default class KaikiSapphireClient<Ready extends true> extends SapphireClient<Ready> implements KaikiClientInterface {

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

        // Not using logger here. Because it resets multiline color
        console.log(colorette.green(Constants.KaikiBotASCII));

        (async () => await this.initializeDatabase())()
            .catch(() => process.exit(1));
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
        return String(this.guildsDb.get(guild.id, "Prefix", process.env.PREFIX));
    };

    private async dailyResetTimer(): Promise<void> {
        setTimeout(async () => {

            // Loop this
            await this.dailyResetTimer();

            // Reset daily currency claims
            await this.resetDailyClaims();

            // Check for "birthdays"
            await this.anniversaryService.birthdayService();

        }, KaikiUtil.timeToMidnight());
    }

    public async initializeServices() {

        this.anniversaryService = new AnniversaryRolesService(this);

        // This will execute at midnight
        await this.dailyResetTimer();
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

        this.botSettings = new DatabaseProvider(this.connection, "BotSettings", { idColumn: "Id" }, false);
        this.botSettings.init()
            .then(() => this.logger.info(`${colorette.green("READY")} - Bot settings provider`))
            .catch(e => this.dbRejected(e));

        this.guildsDb = new DatabaseProvider(this.connection, "Guilds", { idColumn: "Id" });
        this.guildsDb.init()
            .then(() => this.logger.info(`${colorette.green("READY")} - Guild provider`))
            .catch(e => this.dbRejected(e));

        this.dadBotChannels = new DatabaseProvider(this.connection, "DadBotChannels", { idColumn: "ChannelId" });
        this.dadBotChannels.init()
            .then(() => this.logger.info(`${colorette.green("READY")} - DadBot channel provider`))
            .catch(e => this.dbRejected(e));

        this.cache = new KaikiCache(this.orm, this.connection, this.imageAPIs);
        this.money = new MoneyService(this.orm);
    }

    private async presenceLoop(): Promise<NodeJS.Timer> {
        await this.setPresence();

        return setInterval(((scope: KaikiSapphireClient<true>) => {
            return async () => {
                await scope.setPresence();
            };
        })(this), Constants.MAGIC_NUMBERS.LIB.KAIKI.PRESENCE_UPDATE_TIMEOUT);
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
        this.logger.info(`ResetDailyClaims | Daily claims have been reset! Updated ${colorette.green(updated.count)} entries!`);
    }

    async filterOptionalCommands() {
        const commandStore = this.stores.get("commands");

        if (!process.env.KAWAIIKEY || process.env.KAWAIIKEY === "[YOUR_OPTIONAL_KAWAII_KEY]") {
            for (const entry of ["run", "peek", "pout", "lick"]) {
                await commandStore.unload(entry);
            }
            this.logger.warn("No Kawaii key provided. Kawaii API commands will be disabled.");
        }

        // Check if 'neofetch' is available
        try {
            execSync("command -v neofetch >/dev/null 2>&1");
        } catch {
            await commandStore.unload("neofetch");
            this.logger.warn("Neofetch wasn't detected! Neofetch command will be disabled.");
        }
    }

    private dbRejected(e: unknown) {
        this.logger.fatal("Failed to connect to database using MySQL2.", e);
        process.exit(1);
    }
}
