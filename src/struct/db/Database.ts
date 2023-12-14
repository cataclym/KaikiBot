import { PrismaClient } from "@prisma/client";
import { ActivityType } from "discord.js";
import { ConnectionOptions, createPool, FieldPacket, Pool } from "mysql2/promise";
import KaikiSapphireClient from "../../lib/Kaiki/KaikiSapphireClient";

export default class Database {
    constructor(client: KaikiSapphireClient<true>) {
        this._client = client;
    }

    get mySQLConnection(): Pool {
        return this._mySQLConnection;
    }

    private createConfig(): ConnectionOptions {

        const parsedUrl = new URL(encodeURI(String(process.env.DATABASE_URL)));
        const parsedPassword = decodeURIComponent(parsedUrl.password);

        return {
            user: parsedUrl.username,
            password: parsedPassword,
            host: parsedUrl.hostname,
            port: parseInt(parsedUrl.port),
            database: parsedUrl.pathname.slice(1),
            supportBigNumbers: true,
            waitForConnections: true,
        };
    }

    private _client: KaikiSapphireClient<true>;
    public orm: PrismaClient;
    private _mySQLConnection: Pool;

    public async init(): Promise<Database> {
        try {
            this._mySQLConnection = createPool(this.createConfig());
            this.orm = new PrismaClient();
        } catch (e) {
            throw new Error(e);
        }

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
            const newGuild = await this.orm.guilds.create({
                data: {
                    Prefix: String(process.env.PREFIX),
                    Id: BigInt(id),
                },
            });
            this._client.guildsDb.items.set(String(newGuild.Id), newGuild);
            return newGuild;
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
            return this.orm.guildUsers.create({
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

    constructor(array: [any, FieldPacket[]]) {
        const data = array[0][0];
        this.activity = data.Activity;
        this.activityType = data.ActivityType;
        this.currencyName = data.CurrencyName;
        this.currencySymbol = data.CurrencySymbol;
        this.dailyEnabled = Boolean(data.DailyEnabled);
        this.dailyAmount = parseInt(data.DailyAmount);
    }
}
