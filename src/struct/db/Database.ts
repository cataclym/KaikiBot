import { ActivityType } from "discord.js";
import * as mysql2 from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

export class Database {
    private _config: mysql2.ConnectionOptions;
    public orm: PrismaClient;
    public connection: mysql2.Connection;

    constructor() {
        this._config = {
            uri: process.env.DATABASE_URL,
        };
    }
    public async init() {
        const connection = await mysql2.createConnection(this._config)
            .catch((err) => {
                throw err;
            });

        return {
            orm: new PrismaClient(),
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
