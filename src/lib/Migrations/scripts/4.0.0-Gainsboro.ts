import { Migration } from "../Migrations";
import { _MigrationsModel, botModel, commandStatsModel, guildsModel, moneyModel, usersModel } from "../mongoModels";
import { OkPacket } from "mysql2";
import KaikiAkairoClient from "Kaiki/KaikiAkairoClient";
import { blockedCategories } from "../../enums/blockedCategories";

export default class Gainsboro extends Migration {
    private changes: number;
    constructor(data: { hash?: string; name: string; version: string; migration: (client: KaikiAkairoClient) => (Promise<number> | number) }) {
        super(data);
        this.changes = 0;
        this.name = "init_sql";
        this.version = "4.0.0-Gainsboro";
    }

    migration = async (client: KaikiAkairoClient) => {
        const { connection } = client;
        // This migration moves most data from MongoDB to MySQL
        const migration = await _MigrationsModel.find({}).exec();

        for (const { migrationId, versionString } of migration) {
            this.changes++;
            await connection.query("INSERT INTO _Migrations (migrationId, versionString) VALUES (?, ?)",
                [migrationId, versionString],
            );
        }

        const { activity, activityType, currencyName, currencySymbol, dailyAmount, dailyEnabled } = (await botModel.findOne({}).exec())!.settings;
        this.changes++;
        await connection.query("INSERT INTO BotSettings (Id, Activity, ActivityType, CurrencyName, CurrencySymbol, DailyAmount, DailyEnabled) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Id = 1",
            [1, activity || null, activityType || null, currencyName, Number(currencySymbol.codePointAt(0)), dailyAmount, dailyEnabled],
        );

        const guilds = await guildsModel.find({}).exec();

        for (const guild of guilds) {
            this.changes++;
            const { id, settings, registeredAt, leaveRoles, userRoles } = guild;
            const guildBlockedCategories = guild.blockedCategories;
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

            await connection.query("INSERT INTO Guilds (Id, Prefix, Anniversary, DadBot, ErrorColor, OkColor, ExcludeRole, WelcomeChannel, ByeChannel, WelcomeMessage, ByeMessage, stickyRoles, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
                        : null, JSON.stringify(welcome.embed), JSON.stringify(goodbye.embed), stickyRoles, new Date(registeredAt)]);

            if (Object.keys(guildBlockedCategories).length) {
                for (const key in guildBlockedCategories) {
                    this.changes++;

                    await connection.query("INSERT INTO BlockedCategories (GuildId, CategoryTarget) VALUES (?, ?)",
                        // This is dumb. A string can index an enum and return a number.
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        [BigInt(id), blockedCategories[key]]);
                }
            }

            const insertedUsers: {[index: string]: number } = {};

            if (Object.keys(userRoles).length) {
                const userRolesKeyValues = Object.entries(userRoles);
                for (let i = 0; i < Object.keys(userRoles).length; i++) {
                    this.changes++;

                    const [res] = await connection.query<OkPacket>("INSERT INTO GuildUsers (userId, userRole, guildId) VALUES (?, ?, ?)",
                        [BigInt(userRolesKeyValues[i][0]), BigInt(userRolesKeyValues[i][1]), BigInt(guild.id)]);
                    insertedUsers[userRolesKeyValues[i][0]] = res.insertId;
                }
            }

            if (Object.keys(leaveRoles).length) {
                for (const key in leaveRoles) {
                    let insertId;
                    if (insertedUsers[key]) {
                        insertId = insertedUsers[key];
                    }
                    else {
                        this.changes++;
                        await connection.query<OkPacket>("INSERT INTO GuildUsers (userId, userRole, guildId) VALUES (?, ?, ?)",
                            [BigInt(key), userRoles[key] ?? null, BigInt(guild.id)])
                            .then(([res]) => {
                                insertId = res.insertId;
                            });
                    }
                    for (const role of leaveRoles[key]) {
                        this.changes++;
                        await connection.query("INSERT INTO LeaveRoles (RoleId, GuildUserId) VALUES (?, ?)",
                            [BigInt(role), insertId],
                        );
                    }
                }
            }
        }

        const users = await usersModel.find({}).exec();

        for (const user of users) {
            this.changes++;
            const money = await moneyModel.findOne({ id: user.id }).exec();
            const [res] = await connection.query<OkPacket>("INSERT INTO DiscordUsers (userId, amount, createdAt) VALUES (?, ?, ?)",
                [BigInt(user.id), money?.amount ?? 0, new Date(user.registeredAt)],
            );

            for (let i = 0; i < user.todo.length; i++) {
                this.changes++;
                await connection.query("INSERT INTO Todos (userId, string) VALUES (?, ?)",
                    [res.insertId, user.todo[i]],
                );
            }

        // This data will not be migrated due to no guild-user association
        // for (let i = 0; i < user.userNicknames.length; i++) {
        //     await db.query("INSERT INTO UserNicknames (nickname, guildUserId) VALUES (?, ?)", [user.userNicknames[i] ]);
        // }
        }

        const res = await commandStatsModel.findOne({}).exec();

        if (!res) return this.changes;

        for (const key in res.count) {
            this.changes++;
            await connection.query("INSERT INTO CommandStats (commandAlias, count) VALUES (?, ?)",
                [key, res.count[key]],
            );
        }
        return this.changes;
    };
}
