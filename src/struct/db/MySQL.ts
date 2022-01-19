import { ActivityType } from "discord.js";
import * as mysql2 from "mysql2/promise";

export class Database {
    private static _config: mysql2.ConnectionOptions = {
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASS || "root",
        host: "127.0.0.1",
        port: 3306,
        database: "kaikidb",
    }
    async init() {
        const connection = await mysql2.createConnection(Database._config)
            .catch((err) => {
                throw err;
            });

        return {
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
