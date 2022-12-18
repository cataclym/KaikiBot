import pkg from "@prisma/client";
import { Collection, Message, Snowflake } from "discord.js";
import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { RespType } from "../lib/Types/TCustom.js";
import Utility from "../lib/Utility";
import Constants from "../struct/Constants";

export type TEmoteStringTypes = "has_space" | "no_space";
export type TEmoteTrigger = string;
export type TGuildString = Snowflake;
export type TTriggerString = string;
export type TEmoteReactCache = Map<TGuildString, Map<TEmoteStringTypes, Map<TEmoteTrigger, TTriggerString>>>;

type PartitionResult = [[string, bigint][], [string, bigint][]];

export default class KaikiCache {

    public animeQuoteCache: Collection<string, RespType>;
    public cmdStatsCache: Collection<string, number>;
    public emoteReactCache: TEmoteReactCache;
    public dailyProvider: MySQLDailyProvider;
    private readonly connection: () => Pool;
    private orm: pkg.PrismaClient;

    constructor(orm: pkg.PrismaClient, connection: () => Pool) {
        this.connection = connection;
        this.orm = orm;
        this.animeQuoteCache = new Collection<string, RespType>();
        this.cmdStatsCache = new Collection<string, number>();
        this.dailyProvider = new MySQLDailyProvider(this.connection);
        this.emoteReactCache = new Map<TGuildString, Map<TEmoteStringTypes, Map<TEmoteTrigger, TTriggerString>>>();

        (async () => await this.init())();
    }

    public init = async () => setInterval(async () => {
        if (!Object.entries(this.cmdStatsCache).length) return;

        const requests = Object.entries(this.cmdStatsCache)
            .map(([command, amount]) => this.orm.commandStats
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

        await this.orm.$transaction(requests);

        this.cmdStatsCache = new Collection<string, number>();
    }, Constants.MAGIC_NUMBERS.CACHE.FIFTEEN_MINUTES_MS);

    public static async populateERCache(message: Message<true>) {

        const emoteReacts = (await message.client.orm.emojiReactions.findMany({ where: { GuildId: BigInt(message.guildId) } }))
            .map(table => [table.TriggerString, table.EmojiId]);

        message.client.cache.emoteReactCache.set(message.guildId, new Map([["has_space", new Map()], ["no_space", new Map()]]));

        if (!emoteReacts.length) {
            return;
        }

        else {
            const arrays: PartitionResult = Utility.partition(emoteReacts, ([k]) => k.includes(" "));

            for (const arrayHasSpace of arrays[0]) {
                message.client.cache.emoteReactCache.get(message.guildId)?.get("has_space")?.set(arrayHasSpace[0], String(arrayHasSpace[1]));
            }
            for (const arrayNoSpace of arrays[1]) {
                message.client.cache.emoteReactCache.get(message.guildId)?.get("no_space")?.set(arrayNoSpace[0], String(arrayNoSpace[1]));
            }
        }
    }

    // Reacts with emote to specified words
    public async emoteReact(message: Message<true>): Promise<void> {

        const id = message.guildId,
            messageContent = message.content.toLowerCase();

        if (!message.client.cache.emoteReactCache.get(id)) {
            await KaikiCache.populateERCache(message);
        }

        const emotes = message.client.cache.emoteReactCache.get(id);

        if (!emotes) return;

        const matches = Array.from(emotes?.get("has_space")?.keys() || [])
            .filter(k => messageContent.match(new RegExp(k.toLowerCase(), "g")));

        for (const word of messageContent.split(" ")) {
            if (emotes?.get("no_space")?.has(word)) {
                matches.push(word);
            }
        }

        if (!matches.length) return;

        return KaikiCache.emoteReactLoop(message, matches, emotes);
    }

    public static async emoteReactLoop(message: Message, matches: RegExpMatchArray, wordObj: Map<TEmoteStringTypes, Map<TEmoteTrigger, TTriggerString>>) {
        for (const word of matches) {
            const emote = wordObj.get("no_space")?.get(word) || wordObj.get("has_space")?.get(word);
            if (!message.guild?.emojis.cache.has(emote as Snowflake) || !emote) continue;
            await message.react(emote);
        }
    }
}

class MySQLDailyProvider {
    private connection: () => Pool;

    constructor(connection: () => Pool) {
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

