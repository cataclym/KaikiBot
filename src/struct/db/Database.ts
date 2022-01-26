import { ActivityType } from "discord.js";
import * as mysql2 from "mysql2/promise";
import { Connection } from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

type initReturn = {
    orm: PrismaClient,
    connection: Connection
}

export class Database {
    private _config: mysql2.ConnectionOptions;

    constructor() {
        this._config = {
            uri: process.env.DATABASE_URL,
        };
    }
    public async init(): Promise<initReturn> {
        const connection = await mysql2.createConnection(this._config)
            .catch(async () => {
                await mysql2.createConnection({ uri: process.env.DATABASE_URL, database: "mysql" })
                    .then(c => c.execute("CREATE DATABASE IF NOT EXISTS kaikidb")
                        .then(() => c.end()));

                return (await this.init()).connection;
            });

        const prismaClient = new PrismaClient();

        return {
            orm: prismaClient,
            connection: connection,
        };
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
