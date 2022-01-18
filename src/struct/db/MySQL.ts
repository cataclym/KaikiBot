import { createConnection } from "mysql2/promise";
import { ActivityType } from "discord.js";
import { MikroORM } from "@mikro-orm/core";
import config from "../../mikro-orm.config";

export class Database {
    async init() {
        const connection = await createConnection({
            user: process.env.MYSQL_USER || "root",
            password: process.env.MYSQL_PASS || "root",
            host: "127.0.0.1",
            port: 3306,
            database: "kaikidb",
        })
            .catch((err) => {
                throw err;
            });

        return {
            connection: connection,
            orm: await MikroORM.init(config),
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
