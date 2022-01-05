import { Connection, createConnection } from "mysql2/promise";
import { ActivityType } from "discord.js";
import { tableQueries } from "../constants";

export class Database {
  public connection: Connection;
  async init() {
      await createConnection({
          user: process.env.MYSQL_USER || "root",
          password: process.env.MYSQL_PASS || "root",
          host: "127.0.0.1",
          port: 3306,
          database: "kaikidb",
          // debug: true,
      })
          .then(c => {
              this.connection = c;
              // Create all tables
              Object.values(tableQueries).forEach((v) => {
                  void c.query(v);
              });
          })
          .catch((err) => {
              throw err;
          });
      return this.connection;
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
