import { Snowflake } from "discord-api-types";
import { PrismaClient } from "@prisma/client";
import MySQLProvider from "../struct/db/MySQLProvider";
import { Connection } from "mysql2/promise";

// Anime quotes
export type respType = { anime: string, character: string, quote: string };
export type emoteReactObjectType = {[keyWord: string]: Snowflake};
export type separatedEmoteReactTypes = {
        has_space: emoteReactObjectType,
        no_space: emoteReactObjectType
    };

export default class Cache {
    private _orm: PrismaClient;
    private _connection: Connection;
    private dailyClaimsCache: MySQLProvider;

    constructor(orm: PrismaClient, connection: Connection) {
        this._orm = orm;
        this._connection = connection;
        this.dailyClaimsCache = new MySQLProvider(this._connection, "DailyClaims", { idColumn: "UserId" });
    }

    public animeQuoteCache: {[character: string]: respType } = {};
    public cmdStatsCache: {[index: string]: number } = {};

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

        this.cmdStatsCache = {};
    }, 900000);

    public emoteReactCache: {[guild: string]: separatedEmoteReactTypes} = {};
}
