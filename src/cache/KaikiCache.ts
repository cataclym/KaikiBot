import pkg from "@prisma/client";
import { Collection, Message, Snowflake } from "discord.js";
import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { APIs, ClientImageAPIs } from "../lib/APIs/Common/Types";
import { RespType } from "../lib/Types/Miscellaneous";
import Utility from "../lib/Utility";
import Constants from "../struct/Constants";

export type EmoteStringTypes = "has_space" | "no_space";
export type EmoteTrigger = string;
export type GuildString = Snowflake;
export type TriggerString = string;
export type EmoteReactCache = Map<GuildString, Map<EmoteStringTypes, Map<EmoteTrigger, TriggerString>>>;

type PartitionResult = [[string, bigint][], [string, bigint][]];

export default class KaikiCache {

    public animeQuoteCache: Collection<string, RespType>;
    public cmdStatsCache: Map<string, number>;
    public emoteReactCache: EmoteReactCache;
    public dailyProvider: MySQLDailyProvider;
    public imageAPICache: Map<APIs, Map<string, Record<string, any>>>;

    constructor(orm: pkg.PrismaClient, connection: Pool) {
        this.animeQuoteCache = new Collection<string, RespType>();
        this.cmdStatsCache = new Map<string, number>();
        this.dailyProvider = new MySQLDailyProvider(connection);
        this.emoteReactCache = new Map<GuildString, Map<EmoteStringTypes, Map<EmoteTrigger, TriggerString>>>();

        // API cache
        this.imageAPICache = new Map<APIs, Map<string, Record<string, any>>>;

        (async () => await this.init(orm))();
    }

    public init = async (orm: pkg.PrismaClient) => {

        return setInterval(async () => {
            if (!Object.entries(this.cmdStatsCache).length) return;

            const requests = Object.entries(this.cmdStatsCache)
                .map(([command, amount]) => orm.commandStats
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

            await orm.$transaction(requests);

            this.cmdStatsCache = new Map<string, number>();
        }, Constants.MAGIC_NUMBERS.CACHE.FIFTEEN_MINUTES_MS);
    };

    public static async populateERCache(message: Message<true>) {

        const emoteReacts = (await message.client.orm.emojiReactions.findMany({ where: { GuildId: BigInt(message.guildId) } }))
            .map(table => [table.TriggerString, table.EmojiId]);

        message.client.cache.emoteReactCache.set(message.guildId, new Map([["has_space", new Map()], ["no_space", new Map()]]));

        if (emoteReacts.length) {
            const [space, noSpace]: PartitionResult = Utility.partition(emoteReacts, ([k]) => k.includes(" "));

            for (const [key, value] of space) {
                message.client.cache.emoteReactCache.get(message.guildId)?.get("has_space")?.set(key, String(value));
            }
            for (const [key, value] of noSpace) {
                message.client.cache.emoteReactCache.get(message.guildId)?.get("no_space")?.set(key, String(value));
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

        const iterables = emotes?.get("has_space")?.keys();

        if (!iterables) return;

        const properMatches = Array.from(iterables).filter(k => {
            if (!k) return false;
            messageContent.match(new RegExp(k.toLowerCase(), "g"));
        });

        for (const word of messageContent.split(" ")) {
            if (emotes?.get("no_space")?.has(word)) {
                properMatches.push(word);
            }
        }

        if (!properMatches.length) return;

        return KaikiCache.emoteReactLoop(message, properMatches, emotes);
    }

    public static async emoteReactLoop(message: Message, matches: string[], wordObj: Map<EmoteStringTypes, Map<EmoteTrigger, TriggerString>>) {
        for (const word of matches) {
            const emote = wordObj.get("no_space")?.get(word) || wordObj.get("has_space")?.get(word);
            if (!message.guild?.emojis.cache.has(emote as Snowflake) || !emote) continue;
            await message.react(emote);
        }
    }

    public populateImageAPICache(apis: ClientImageAPIs) {
        Object.keys(apis).forEach((api: APIs) => {
            this.imageAPICache.set(api, new Map<string, Record<string, any>>);
        });
    }
}

class MySQLDailyProvider {
    private connection: Pool;

    constructor(connection: Pool) {
        this.connection = connection;
    }

    async hasClaimedDaily(id: string) {
        const [rows] = await this.connection.query<RowDataPacket[]>("SELECT ClaimedDaily FROM DiscordUsers WHERE UserId = ?", [BigInt(id)]);
        return rows[0]?.ClaimedDaily ?? true;
    }

    // Sets claimed status to true
    async setClaimed(id: string) {
        return this.connection.query<ResultSetHeader>("UPDATE DiscordUsers SET ClaimedDaily = ? WHERE UserId = ?", [true, BigInt(id)])
            .then(([result]) => result.changedRows
                ? result.changedRows > 0
                : false)
            .catch(() => false);
    }
}

