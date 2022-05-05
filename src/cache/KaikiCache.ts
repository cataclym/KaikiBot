import pkg from "@prisma/client";
import { Collection, Message, Snowflake } from "discord.js";
import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { respType } from "../lib/Types/TCustom.js";
import Utility from "../lib/Utility";

export type TEmoteStringTypes = "has_space" | "no_space";
export type TEmoteTrigger = string;
export type TGuildString = Snowflake;
export type TTriggerString = string;
export type TEmoteReactCache = Map<TGuildString, Map<TEmoteStringTypes, Map<TEmoteTrigger, TTriggerString>>>;

type partitionResult = [[string, bigint][], [string, bigint][]];

export default class KaikiCache {

    public animeQuoteCache: Collection<string, respType>;
    public cmdStatsCache: Collection<string, number>;
    public emoteReactCache: TEmoteReactCache;
    public dailyProvider: MySQLDailyProvider;
    private _connection: () => Connection;
    private _orm: pkg.PrismaClient;

    constructor(orm: pkg.PrismaClient, connection: () => Connection) {
        this._connection = connection;
        this._orm = orm;
        this.animeQuoteCache = new Collection<string, respType>();
        this.cmdStatsCache = new Collection<string, number>();
        this.dailyProvider = new MySQLDailyProvider(this._connection);
        this.emoteReactCache = new Map<TGuildString, Map<TEmoteStringTypes, Map<TEmoteTrigger, TTriggerString>>>();
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

    public async populateERCache(message: Message<true>) {

        const emoteReacts = (await message.client.orm.emojiReactions.findMany({ where: { GuildId: BigInt(message.guildId) } }))
            .map(table => [table.TriggerString, table.EmojiId]);

        message.client.cache.emoteReactCache.set(message.guildId, new Map([["has_space", new Map()], ["no_space", new Map()]]));

        if (!emoteReacts.length) {
            return;
        }

        else {
            const arrays: partitionResult = Utility.partition(emoteReacts, ([k]) => k.includes(" "));

            for (const array_has_space of arrays[0]) {
                message.client.cache.emoteReactCache.get(message.guildId)?.get("has_space")?.set(array_has_space[0], String(array_has_space[1]));
            }
            for (const array_no_space of arrays[1]) {
                message.client.cache.emoteReactCache.get(message.guildId)?.get("no_space")?.set(array_no_space[0], String(array_no_space[1]));
            }
        }
    }

    // Reacts with emote to specified words
    public async emoteReact(message: Message<true>): Promise<void> {

        const id = message.guildId,
            messageContent = message.content.toLowerCase();
        let emotes = message.client.cache.emoteReactCache.get(id);

        if (!emotes) {
            await this.populateERCache(message);
            emotes = message.client.cache.emoteReactCache.get(id);
        }

        const matches = Array.from(emotes?.get("has_space")?.keys() || [])
            .filter(k => messageContent.match(new RegExp(k.toLowerCase(), "g")));

        for (const word of messageContent.split(" ")) {
            if (emotes?.get("no_space")?.has(word)) {
                matches.push(word);
            }
        }

        if (!matches.length) return;

        return this.emoteReactLoop(message, matches, emotes!);
    }

    public async emoteReactLoop(message: Message, matches: RegExpMatchArray, wordObj: Map<TEmoteStringTypes, Map<TEmoteTrigger, TTriggerString>>) {
        for (const word of matches) {
            const emote = wordObj.get("no_space")?.get(word) || wordObj.get("has_space")?.get(word);
            if (!message.guild?.emojis.cache.has(emote as Snowflake) || !emote) continue;
            await message.react(emote);
        }
    }
}

class MySQLDailyProvider {
    private connection: () => Connection;

    constructor(connection: () => Connection) {
        this.connection = connection;
    }

    async checkClaimed(id: string) {
        return this.connection().query<RowDataPacket[]>("SELECT ClaimedDaily FROM DiscordUsers WHERE UserId = ?", [BigInt(id)])
            .then(([row]) => row[0].ClaimedDaily ?? false);
    }

    // Sets claimed status to true
    async setClaimed(id: string) {
        return this.connection().query<ResultSetHeader>("UPDATE DiscordUsers SET ClaimedDaily = ? WHERE UserId = ?", [true, BigInt(id)])
            .then(([result]) => result.changedRows
                ? result.changedRows > 0
                : false)
            .catch(() => false);
    }
}

