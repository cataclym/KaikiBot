import { PrismaClient } from "@prisma/client";
import { ActivityType } from "discord.js";
import * as mysql2 from "mysql2/promise";

export default class Database {
    private _config: mysql2.ConnectionOptions = {
        uri: process.env.DATABASE_URL,
        supportBigNumbers: true,
    };
    public orm: PrismaClient;
    public mySQLConnection: any;

    public async init(): Promise<Database> {
        this.mySQLConnection = await mysql2.createConnection(this._config)
            .catch(async () => {
                await mysql2.createConnection({ uri: process.env.DATABASE_URL, database: "mysql" })
                    .then(c => c.execute("CREATE DATABASE IF NOT EXISTS kaikidb")
                        .then(() => c.end()),
                    );

                return this.init();
            });

        this.orm = new PrismaClient();

        const botSettings = await this.orm.botSettings.findFirst();

        if (!botSettings) {
            await this.orm.botSettings.create({
                data: { Id: 1 },
            });
        }

        return this;
    }

    public async getOrCreateGuild(id: string | bigint) {
        const guild = await this.orm.guilds.findUnique({
            where: {
                Id: BigInt(id),
            },
        });

        if (!guild) {
            return await this.orm.guilds.create({
                data: {
                    Prefix: process.env.PREFIX!,
                    Id: BigInt(id),
                },
            });
        }
        return guild;
    }

    public async getOrCreateGuildUser(userId: string | bigint, guildId: string | bigint) {
        const guildUser = await this.orm.guildUsers.findFirst({
            where: {
                UserId: BigInt(userId),
                GuildId: BigInt(guildId),
            },
        });

        if (!guildUser) {
            return await this.orm.guildUsers.create({
                data: {
                    UserId: BigInt(userId),
                    Guilds: {
                        connect: {
                            Id: BigInt(guildId),
                        },
                    },
                },
            });
        }
        return guildUser;
    }
}

export class BotConfig {
    private activity: string;
    private activityType: ActivityType;
    private currencyName: string;
    private currencySymbol: string;
    private dailyEnabled: boolean;
    private dailyAmount: number;

    constructor(array: [any, any]) {
        const data = array[0][0];
        this.activity = data.Activity;
        this.activityType = data.ActivityType;
        this.currencyName = data.CurrencyName;
        this.currencySymbol = String.fromCodePoint(data.CurrencySymbol);
        this.dailyEnabled = Boolean(data.DailyEnabled);
        this.dailyAmount = parseInt(data.DailyAmount);
    }
}
