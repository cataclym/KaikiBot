import pkg from "@prisma/client";
import { Collection, GuildMember, Message, Snowflake } from "discord.js";
import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { APIs, ClientImageAPIs } from "../APIs/Common/Types";
import KaikiUtil from "../KaikiUtil";
import Constants from "../../struct/Constants";
import {
    EmoteReactCache,
    EmoteTrigger,
    GuildString,
    PartitionResult,
    TriggerString,
} from "../Interfaces/Kaiki/KaikiCache";
import fs from "fs/promises";
import { container } from "@sapphire/pieces";

export enum ERCacheType {
	HAS_SPACE,
	NO_SPACE,
}

export type GuildMemberCache = {[key: Snowflake]: Collection<Snowflake, GuildMember>}

export default class KaikiCache {
    public cmdStatsCache: Map<string, number>;
    public emoteReactCache: EmoteReactCache;
    public dailyProvider: MySQLDailyProvider;
    public imageAPICache: Map<APIs, Map<string, Record<string, unknown>>>;
    private imageAPIs: ClientImageAPIs;

    constructor(
        orm: pkg.PrismaClient,
        connection: Pool,
        imageAPIs: ClientImageAPIs
    ) {
        this.cmdStatsCache = new Map<string, number>();
        this.dailyProvider = new MySQLDailyProvider(connection);
        this.emoteReactCache = new Map<
			GuildString,
			Map<ERCacheType, Map<EmoteTrigger, TriggerString>>
		>();

        // API cache
        this.imageAPIs = imageAPIs;
        this.imageAPICache = new Map<
			APIs,
			Map<string, Record<string, unknown>>
		>();

        void this.init(orm);
        this.populateImageAPICache();
    }

    // Creates a loop of 15 minutes to synchronize the command stats cache to the DB.
    public async init(orm: pkg.PrismaClient) {
        return setInterval(async () => {
            void this.syncCommandStats(orm);
        }, Constants.MAGIC_NUMBERS.CACHE.FIFTEEN_MINUTES_MS);
    }

    public incrementCommand(command: string) {
        let number = this.cmdStatsCache.get(command);

        if (number !== undefined) {
            this.cmdStatsCache.set(command, number++);
        } else {
            this.cmdStatsCache.set(command, 1);
        }
    }

    private async syncCommandStats(orm: pkg.PrismaClient) {
        if (!this.cmdStatsCache.size) return;

        const requests = Array(...this.cmdStatsCache.entries()).map(
            ([command, amount]) =>
                orm.commandStats.upsert({
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
                })
        );
        await orm.$transaction(requests);
        this.cmdStatsCache = new Map();
    }

    public static async populateERCache(message: Message<true>) {
        const emoteReacts = (
            await message.client.orm.emojiReactions.findMany({
                where: { GuildId: BigInt(message.guildId) },
            })
        ).map((table) => [table.TriggerString, table.EmojiId]);
        const { emoteReactCache } = message.client.cache;

        // Populate guild cache with empty map
        emoteReactCache.set(
            message.guildId,
            new Map([
                [ERCacheType.HAS_SPACE, new Map()],
                [ERCacheType.NO_SPACE, new Map()],
            ])
        );

        // Getting the guild cache
        const guildCache = emoteReactCache.get(message.guildId);

        if (emoteReacts.length) {
            const [space, noSpace]: PartitionResult = KaikiUtil.partition(
                emoteReacts,
                ([k]: string[]) => k.includes(" ")
            );

            for (const [key, value] of space) {
                guildCache?.get(ERCacheType.HAS_SPACE)?.set(key, String(value));
            }
            for (const [key, value] of noSpace) {
                guildCache?.get(ERCacheType.NO_SPACE)?.set(key, String(value));
            }
        }
    }

    // Reacts with emote to words in Emote React cache.
    public async emoteReact(message: Message<true>): Promise<void> {
        const { guildId } = message,
            messageContent = message.content.toLowerCase();

        if (!message.client.cache.emoteReactCache.get(guildId)) {
            await KaikiCache.populateERCache(message);
        }

        const emotes = message.client.cache.emoteReactCache.get(guildId);

        if (!emotes) return;

        // First find matches with spaces
        const matches = Array.from(
            emotes?.get(ERCacheType.HAS_SPACE)?.keys() || []
        ).filter((k) => {
            if (!k) return false;
            return messageContent.match(new RegExp(k.toLowerCase(), "g"));
        });

        // Then push matches that have no spaces
        for (const word of messageContent.split(" ")) {
            if (emotes?.get(ERCacheType.NO_SPACE)?.has(word)) {
                matches.push(word);
            }
        }

        if (!matches.length) return;

        return KaikiCache.emoteReactLoop(message, matches, emotes);
    }

    public static async emoteReactLoop(
        message: Message,
        matches: string[],
        wordObj: Map<ERCacheType, Map<EmoteTrigger, TriggerString>>
    ) {
        for (const word of matches) {
            const emote =
				wordObj.get(ERCacheType.NO_SPACE)?.get(word) ||
				wordObj.get(ERCacheType.HAS_SPACE)?.get(word);
            if (!message.guild?.emojis.cache.has(emote as Snowflake) || !emote)
                continue;
            await message.react(emote);
        }
    }

    private populateImageAPICache() {
        Object.keys(this.imageAPIs).forEach((api: APIs) => {
            this.imageAPICache.set(
                api,
                new Map<string, Record<string, unknown>>()
            );
        });
    }

    public async readSavedCache() {
        const files = await fs.readdir(".")
        const caches = files.filter(f => f.endsWith(".cache"));

        for (const filePath of caches) {

            const content = await fs.readFile(filePath, { encoding: "utf-8" })

            if (!content) {
                await fs.unlink(filePath)
                continue;
            }

            const guildMembersCache: GuildMemberCache = JSON.parse(content)

            for (const [k, v] of Object.entries(guildMembersCache)) {

                const cache = container.client.guilds.cache.get(k)?.members.cache;
                const localCache = new Collection(v.entries());

                if (!cache || !localCache?.size) continue;

                for (const [key, member] of localCache.entries()) {
                    cache.set(key, member);
                }
            }
            await fs.unlink(filePath)
        }
    }
}

class MySQLDailyProvider {
    private connection: Pool;

    constructor(connection: Pool) {
        this.connection = connection;
    }

    async hasClaimedDaily(id: string) {
        const [rows] = await this.connection.query<RowDataPacket[]>(
            "SELECT ClaimedDaily FROM DiscordUsers WHERE UserId = ?",
            [BigInt(id)]
        );
        return rows[0]?.ClaimedDaily ?? true;
    }

    // Sets claimed status to true
    async setClaimed(id: string) {
        return this.connection
            .query<ResultSetHeader>(
                "UPDATE DiscordUsers SET ClaimedDaily = ? WHERE UserId = ?",
                [true, BigInt(id)]
            )
            .then(([result]) =>
                result.affectedRows ? result.affectedRows > 0 : false
            )
            .catch(() => false);
    }
}
