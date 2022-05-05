import { Snowflake } from "discord.js";
import { OkPacket } from "mysql2";
import { RowDataPacket } from "mysql2/promise";
import { blockedCategories } from "../../enums/blockedCategories";
import KaikiAkairoClient from "../../Kaiki/KaikiAkairoClient";
import { Migration } from "../Migrations";
import { botModel, commandStatsModel, guildsModel, moneyModel, usersModel } from "../mongoModels";

export default class Gainsboro extends Migration {
    private changes: number;

    embedToMessageOptions(embed: any): string {
        const parsed = typeof embed === "string" ? JSON.parse(embed) : embed;
        return JSON.stringify({
            embeds: [parsed],
        });
    }

    constructor() {
        super({
            name: "init_sql",
            version: "4.0.0-Gainsboro",

            migration: async (client: KaikiAkairoClient) => {
                this.changes = 0;

                const { connection } = client;
                // This migration moves most data from MongoDB to MySQL

                const {
                    activity,
                    activityType,
                    currencyName,
                    currencySymbol,
                    dailyAmount,
                    dailyEnabled,
                } = (await botModel.findOne({}).exec())!.settings;
                this.changes++;
                await connection().query("INSERT INTO BotSettings (Id, Activity, ActivityType, CurrencyName, CurrencySymbol, DailyAmount, DailyEnabled) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Id = 1",
                    [1, activity || null, activityType || null, currencyName, Number(currencySymbol.codePointAt(0)), dailyAmount, dailyEnabled],
                );

                const guilds = await guildsModel.find({}).exec();

                for (const guild of guilds) {

                    if (!client.guilds.cache.has(guild.id)) {
                        continue;
                    }

                    this.changes++;
                    const { id, settings, registeredAt, leaveRoles, userRoles } = guild;
                    const guildBlockedCategories = guild.blockedCategories;
                    const emojiStats = guild.emojiStats;
                    const emojiReactions = guild.emojiReactions;
                    const {
                        prefix,
                        anniversary,
                        dadBot,
                        errorColor,
                        okColor,
                        excludeRole,
                        goodbye,
                        welcome,
                        stickyRoles,
                    } = settings;

                    const excludeGuildRole = (client.guilds.cache.get(id) || await client.guilds.fetch(id))
                        ?.roles.cache.find(r => r.name === excludeRole);

                    await connection().query("INSERT INTO Guilds (Id, Prefix, Anniversary, DadBot, ErrorColor, OkColor, ExcludeRole, WelcomeChannel, ByeChannel, WelcomeMessage, ByeMessage, StickyRoles, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        [BigInt(id), prefix, anniversary, dadBot.enabled,
                            typeof errorColor === "string"
                                ? parseInt(errorColor.replace("#", ""), 16)
                                : errorColor,
                            typeof okColor === "string"
                                ? parseInt(okColor.replace("#", ""), 16)
                                : okColor,
                            excludeGuildRole
                                ? BigInt(excludeGuildRole.id)
                                : null,
                            welcome.channel
                                ? BigInt(welcome.channel)
                                : null,
                            goodbye.channel
                                ? BigInt(goodbye.channel)
                                : null, this.embedToMessageOptions(welcome.embed), this.embedToMessageOptions(goodbye.embed), stickyRoles, new Date(registeredAt)]);

                    if (Object.keys(guildBlockedCategories).length) {
                        for (const key in guildBlockedCategories) {
                            this.changes++;

                            await connection().query("INSERT INTO BlockedCategories (GuildId, CategoryTarget) VALUES (?, ?)",
                                // This is dumb. A string can index an enum and return a number.
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                [BigInt(id), blockedCategories[key]]);
                        }
                    }

                    const insertedUsers: Snowflake[] = [];

                    if (Object.keys(userRoles).length) {
                        const userRolesKeyValues = Object.entries(userRoles);
                        for (let i = 0; i < Object.keys(userRoles).length; i++) {
                            this.changes++;

                            await connection().query<OkPacket>("INSERT INTO GuildUsers (UserId, UserRole, GuildId) VALUES (?, ?, ?)",
                                [BigInt(userRolesKeyValues[i][0]), BigInt(userRolesKeyValues[i][1]), BigInt(guild.id)]);

                            insertedUsers.push(userRolesKeyValues[i][0]);
                        }
                    }

                    if (Object.keys(leaveRoles).length) {
                        for (const key in leaveRoles) {

                            if (!insertedUsers.includes(key)) {
                                this.changes++;

                                await connection().query<OkPacket>("INSERT INTO GuildUsers (UserId, UserRole, GuildId) VALUES (?, ?, ?)",
                                    [BigInt(key), userRoles[key] ?? null, BigInt(guild.id)]);
                                insertedUsers.push(key);
                            }

                            for (const role of leaveRoles[key]) {
                                this.changes++;

                                await connection().query("INSERT INTO LeaveRoles (RoleId, GuildUserId, GuildId) VALUES (?, ?, ?)",
                                    [BigInt(role), BigInt(key), BigInt(guild.id)],
                                );
                            }
                        }
                    }

                    if (emojiReactions && Object.keys(emojiReactions).length) {
                        for (const reaction in emojiReactions) {
                            this.changes++;

                            await connection().query("INSERT INTO EmojiReactions (EmojiId, TriggerString, GuildId) VALUES (?, ?, ?)",
                                [BigInt(emojiReactions[reaction]), reaction, BigInt(guild.id)]);
                        }
                    }

                    if (emojiStats && Object.keys(emojiStats).length) {
                        for (const statistic in emojiStats) {
                            this.changes++;

                            await connection().query("INSERT INTO EmojiStats (EmojiId, Count, GuildId) VALUES (?, ?, ?)",
                                [BigInt(statistic), BigInt(emojiStats[statistic]), BigInt(guild.id)]);
                        }
                    }
                }

                const users = await usersModel.find({}).exec();

                for (const user of users) {
                    this.changes++;

                    const money = await moneyModel.findOne({ id: user.id }).exec();
                    await connection().query<OkPacket>("INSERT INTO DiscordUsers (UserId, Amount, CreatedAt) VALUES (?, ?, ?)",
                        [BigInt(user.id), money?.amount ?? 0, new Date(user.registeredAt)],
                    );

                    for (let i = 0; i < user.todo.length; i++) {
                        this.changes++;

                        await connection().query("INSERT INTO Todos (UserId, String) VALUES (?, ?)",
                            [BigInt(user.id), user.todo[i]],
                        );
                    }

                    const filteredGuilds = client.guilds.cache.filter(g => g.members.cache.has(user.id));

                    for (let i = 0; i < user.userNicknames.length; i++) {

                        for (const guild of filteredGuilds.keys()) {
                            this.changes++;

                            const query = "INSERT INTO UserNicknames (Nickname, GuildUserId, GuildId) VALUES (?, ?, ?)",
                                values = [user.userNicknames[i], BigInt(user.id), BigInt(guild)];

                            const res = await connection().query<RowDataPacket[][]>("SELECT * FROM GuildUsers WHERE UserId = ? AND GuildId = ?",
                                [BigInt(user.id), BigInt(guild)],
                            );

                            if (!res[0] || !res[0].length) {
                                await connection().query("INSERT INTO GuildUsers (UserId, GuildId) VALUES (?, ?)",
                                    [BigInt(user.id), BigInt(guild)],
                                )
                                    .then(async () => await connection().query(query, values));
                            }

                            else {
                                await connection().query(query, values);
                            }
                        }
                    }
                }

                const res = await commandStatsModel.findOne({}).exec();

                if (!res) return this.changes;

                for (const key in res.count) {
                    this.changes++;
                    await connection().query("INSERT INTO CommandStats (commandAlias, count) VALUES (?, ?)",
                        [key, res.count[key]],
                    );
                }
                return this.changes;
            },
        });
    }
}
