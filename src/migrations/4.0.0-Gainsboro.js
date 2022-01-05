import { Migration } from "./migrations";
import {
    _MigrationsModel,
    botModel,
    commandStatsModel,
    guildsModel,
    moneyModel,
    usersModel,
} from "../struct/db/models";
import { blockedCategories as blckCats } from "../struct/constants";

export default new Migration({
    name: "init_sql",
    version: "4.0.0-Gainsboro",
    migration: async (db) => {

        let changes = 0;

        const migration = await _MigrationsModel.find({}).exec();

        for (const { migrationId, versionString } of migration) {
            changes++;
            await db.query("INSERT INTO _Migrations (migrationId, versionString) VALUES (?, ?)",
                [migrationId, versionString],
            );
        }

        const { activity, activityType, currencyName, currencySymbol, dailyAmount, dailyEnabled } = (await botModel.findOne({}).exec()).settings;
        changes++;
        await db.query("INSERT INTO BotSettings (Id, Activity, ActivityType, CurrencyName, CurrencySymbol, DailyAmount, DailyEnabled) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [1, activity, activityType, currencyName, Number(currencySymbol.codePointAt(0)), dailyAmount, dailyEnabled],
        );

        const guilds = await guildsModel.find({}).exec();

        for (const guild of guilds) {
            changes++;
            const { id, settings, blockedCategories, registeredAt, leaveRoles, userRoles } = guild;
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

            await db.query("INSERT INTO Guilds (Id, Prefix, Anniversary, DadBot, ErrorColor, OkColor, ExcludeRole, WelcomeChannel, ByeChannel, WelcomeMessage, ByeMessage, stickyRoles, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [Number(id), prefix, anniversary, dadBot.enabled,
                    typeof errorColor === "string"
                        ? parseInt(errorColor.replace("#", ""), 16)
                        : errorColor,
                    typeof okColor === "string"
                        ? parseInt(okColor.replace("#", ""), 16)
                        : okColor,
                    excludeRole, Number(welcome.channel), Number(goodbye.channel), JSON.stringify(welcome.embed), JSON.stringify(goodbye.embed), stickyRoles, new Date(registeredAt)]);

            if (Object.keys(blockedCategories).length) {
                for (const key in blockedCategories) {
                    changes++;
                    await db.query("INSERT INTO BlockedCategories (GuildId, CategoryTarget) VALUES (?, ?)",
                        [Number(id), blckCats[key]]);
                }
            }

            const insertedUsers = {};

            if (Object.keys(userRoles).length) {
                const userRolesKeyValues = Object.entries(userRoles);
                for (let i = 0; i < Object.keys(userRoles).length; i++) {
                    changes++;

                    const { insertId } = await db.query("INSERT INTO GuildUsers (userId, userRole, guildId) VALUES (?, ?, ?)",
                        [Number(userRolesKeyValues[i][0]), Number(userRolesKeyValues[i][1]), Number(guild.id)]);
                    insertedUsers[userRolesKeyValues[i][0]] = insertId;
                }
            }

            if (Object.keys(leaveRoles).length) {
                for (const key in leaveRoles) {
                    let insertId;
                    if (insertedUsers[key]) {
                        insertId = insertedUsers[key];
                    }
                    else {
                        changes++;
                        await db.query("INSERT INTO GuildUsers (userId, userRole, guildId) VALUES (?, ?, ?)",
                            [Number(key), userRoles[key] ?? null, Number(guild.id)])
                            .then((res) => {
                                insertId = res[0].insertId;
                            });
                    }
                    for (const role of leaveRoles[key]) {
                        changes++;
                        await db.query("INSERT INTO LeaveRoles (roleId, guildUserId) VALUES (?, ?)",
                            [Number(role), insertId],
                        );
                    }
                }
            }
        }

        const users = await usersModel.find({}).exec();

        for (const user of users) {
            changes++;
            const money = await moneyModel.findOne({ id: user.id }).exec();
            const [res] = await db.query("INSERT INTO DiscordUsers (userId, amount, createdAt) VALUES (?, ?, ?)",
                [Number(user.id), money?.amount ?? 0, new Date(user.registeredAt)],
            );

            for (let i = 0; i < user.todo.length; i++) {
                changes++;
                await db.query("INSERT INTO Todos (userId, string) VALUES (?, ?)",
                    [res.insertId, user.todo[i]],
                );
            }

            // This data will not be migrated due to no guild-user association
            // for (let i = 0; i < user.userNicknames.length; i++) {
            //     await db.query("INSERT INTO UserNicknames (nickname, guildUserId) VALUES (?, ?)", [user.userNicknames[i] ]);
            // }
        }

        const { count } = await commandStatsModel.findOne({}).exec();

        for (const key in count) {
            changes++;
            await db.query("INSERT INTO CommandStats (commandAlias, count) VALUES (?, ?)",
                [key, count[key]],
            );
        }

        return changes;
    },
});
