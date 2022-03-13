import pkg from "@prisma/client";
import { Collection, Snowflake } from "discord.js";
import { Connection, RowDataPacket } from "mysql2/promise";
import { respType } from "../lib/Types/TCustom.js";

export type TEmoteStringTypes = "has_space" | "no_space";
export type TEmoteTrigger = string;
export type TGuildString = Snowflake;
export type TTriggerString = string;
export type TEmoteReactCache = Map<TGuildString, Map<TEmoteStringTypes, Map<TEmoteTrigger, TTriggerString>>>;

export default class Cache {
    public animeQuoteCache: Collection<string, respType>;
    public cmdStatsCache: Collection<string, number>;
    public emoteReactCache: TEmoteReactCache;
    public dailyProvider: MySQLDailyProvider;
    private readonly _connection: Connection;
    private _orm: pkg.PrismaClient;

    constructor(orm: pkg.PrismaClient, connection: Connection) {
        this._connection = connection;
        this._orm = orm;
        this.animeQuoteCache = new Collection<string, respType>();
        this.cmdStatsCache = new Collection<string, number>();
        this.dailyProvider = new MySQLDailyProvider(this._connection);
        this.emoteReactCache = new Map<TGuildString, Map<TEmoteStringTypes, Map<TEmoteTrigger, TTriggerString>>>();
        this.initDailyProvider();
    }

    public init = async () => setInterval(async () => {
        if (!Object.entries(this.cmdStatsCache).length) return;

        const requests = Object.entries(this.cmdStatsCache)
            .map(([command, amount]) => this._orm.commandStats
                .upsert({
                    where: {
                        CommandAlias: command,
                    },
                    create: {
                        CommandAlias: command,
                        Count: amount,
                    },
                    update: {
                        Count: {
                            increment: amount,
                        },
                    },
                }));

        await this._orm.$transaction(requests);

        this.cmdStatsCache = new Collection<string, number>();
    }, 900000);

    async clearCache(dailyReset = false) {
        if (dailyReset) {
            await this._orm.discordUsers.updateMany({
                where: {
                    ClaimedDaily: true,
                },
                data: {
                    ClaimedDaily: false,
                },
            });
            await this.dailyProvider.init();
        }
    }

    private initDailyProvider() {
        (async () => await this.dailyProvider.init())();
    }
}

class MySQLDailyProvider {
    private _db: Connection;
    private _tableName = "DiscordUsers";
    private _dataColumn = "ClaimedDaily";
    private _idColumn = "UserId";
    private items: Collection<string, boolean>;

    constructor(connection: Connection) {
        this._db = connection;
    }

    async init(): Promise<void> {
        const [rows] = <RowDataPacket[][]> await this._db.query({
            sql: `SELECT ${this._idColumn}, ${this._dataColumn}
                  FROM ${this._tableName}`,
            rowsAsArray: true,
        });

        for (const row of rows) {
            this.items.set(row[this._idColumn], row[this._dataColumn]);
        }
    }

    get(id: string, defaultValue: any) {
        if (this.items.has(id)) {
            const value = this.items.get(id);
            return value == null ? defaultValue : value;
        }

        return defaultValue;
    }

    set(id: string, value: boolean) {
        const data = this.items.get(id) || false;
        const exists = this.items.has(id);

        this.items.set(id, value);

        return this._db.execute(exists
            ? `UPDATE ${this._tableName}
               SET ${this._dataColumn} = $value
               WHERE ${this._idColumn} = $id`
            : `INSERT INTO ${this._tableName} (${this._idColumn}, ${this._dataColumn})
               VALUES ($id, $value)`, {
            $id: id,
            $value: JSON.stringify(data),
        });

    }

    delete(id: string) {
        const data = this.items.get(id) || false;

        return this._db.execute(`UPDATE ${this._tableName}
                                 SET ${this._dataColumn} = $value
                                 WHERE ${this._idColumn} = $id`, {
            $id: id,
            $value: JSON.stringify(data),
        });
    }

    clear(id: string) {
        this.items.delete(id);
        return this._db.execute(`DELETE
                                 FROM ${this._tableName}
                                 WHERE ${this._idColumn} = $id`, { $id: id });
    }
}

