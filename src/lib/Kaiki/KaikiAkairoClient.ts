import { type PrismaClient } from "@prisma/client";
import { SapphireClient } from "@sapphire/framework";
import chalk from "chalk";
import { execSync } from "child_process";
import { GatewayIntentBits, Guild, Partials, User } from "discord.js";
import logger from "loglevel";
import { Pool } from "mysql2/promise";
import { join } from "path";
import KaikiCache from "../../cache/KaikiCache";
import Constants from "../../struct/Constants";
import Database from "../../struct/db/Database";
import DatabaseProvider from "../../struct/db/DatabaseProvider";
import AnniversaryRolesService from "../AnniversaryRolesService";
import { ClientImageAPIs } from "../APIs/Common/Types";
import KawaiiAPI from "../APIs/KawaiiAPI";
import NekosLife from "../APIs/nekos.life";
import NekosAPI from "../APIs/NekosAPI";
import PurrBot from "../APIs/PurrBot";
import WaifuIm from "../APIs/waifu.im";
import WaifuPics from "../APIs/WaifuPics";
import HentaiService from "../Hentai/HentaiService";
import PackageJSON from "../Interfaces/Common/PackageJSON";
import { MoneyService } from "../Money/MoneyService";
import Utility from "../Utility";

export default class KaikiAkairoClient<Ready extends true> extends SapphireClient<Ready> {

    public anniversaryService: AnniversaryRolesService;
    public botSettings: DatabaseProvider;
    public cache: KaikiCache;
    public connection: () => Pool;
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
            defaultCooldown: {
                delay: 1000,
            },
            defaultPrefix: process.env.PREFIX,
            caseInsensitiveCommands: true,
        });
        this.initializeDatabase();
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

        }, Utility.timeToMidnight());
    }

    public async initializeServices() {

        this.anniversaryService = new AnniversaryRolesService(this);

        // This will execute at midnight
        await this.dailyResetTimer();
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
                this.cache.populateImageAPICache(this.imageAPIs);
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

            const acType = Constants.activityTypes[db.ActivityType];

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

    private filterOptionalCommands() {
        const filterArray = [];
        if (!process.env.KAWAIIKEY || process.env.KAWAIIKEY === "[YOUR_OPTIONAL_KAWAII_KEY]") {
            const dir = join(__dirname, "..", "..", "commands", "Interactions");
            filterArray.push(`${dir}/run.js`, `${dir}/peek.js`, `${dir}/pout.js`, `${dir}/lick.js`);
        }

        // Check if 'neofetch' is available
        try {
            execSync("command -v neofetch >/dev/null 2>&1");
        }
        catch {
            filterArray.push(join(__dirname, "..", "..", "commands", "Fun", "neofetch.js"));
            logger.warn("Neofetch wasn't detected! Neofetch command will be disabled.");
        }
    }
}
