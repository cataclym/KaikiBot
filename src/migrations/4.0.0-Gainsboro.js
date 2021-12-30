import { Migration } from "./migrations";
import { guildsModel, moneyModel, usersModel } from "../struct/db/models";

export default new Migration({
    name: "init_sql",
    version: "4.0.0-Gainsboro",
    migration: async (db) => {

        const guilds = await guildsModel.find({}).exec();

        for (const guild of guilds) {

            const { settings, blockedCategories, registeredAt, leaveRoles } = guild;
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

            await db.query("INSERT INTO Guilds (prefix, anniversary, dadbot, errorColor, okColor, excludeRole, welcomeChannel, byeChannel, welcomeMessage, byeMessage, stickyRoles, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [prefix, anniversary, dadBot.enabled, errorColor, okColor, excludeRole, welcome.channel, goodbye.channel, welcome.embed, goodbye.embed, stickyRoles, registeredAt]);

            if (Object.keys(blockedCategories).length) {
                await db.query("INSERT INTO BlockedCategories (guildId, Administration, Anime, Emotes, Fun, Gambling, NSFW, [Owner only], Reactions, Roles, [Server settings], Utility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [guild.id, blockedCategories.Administration || false,
                        blockedCategories.Anime || false,
                        blockedCategories.Emotes || false,
                        blockedCategories.Fun || false,
                        blockedCategories.Gambling || false,
                        blockedCategories.NSFW || false,
                        blockedCategories["Owner only"] || false,
                        blockedCategories.Reactions || false,
                        blockedCategories.Roles || false,
                        blockedCategories["Server settings"] || false,
                        blockedCategories.Utility || false,
                    ]);
            }

            if (Object.keys(leaveRoles).length) {
                for (const key in leaveRoles) {

                    const guildUser = await db.query("SELECT userId FROM GuildUsers WHERE");

                    for (const role of leaveRoles[key]) {
                        await db.query("INSERT INTO LeaveRoles (roleId, guildUserId) VALUES (?, ?)",
                            [Number(role), insertId],
                        );
                    }

                    const { insertId } = await db.query("INSERT INTO GuildUsers (userId, userRole, guildId) VALUES (?, ?, ?)",
                        [Number(key), guild.userRoles[key] ?? null, guild.id],
                    );
                }
            }
        }

        const users = await usersModel.find({}).exec();

        for (const user of users) {
            const money = await moneyModel.findOne({ id: user.id }).exec();
            const [res] = await db.query("INSERT INTO DiscordUsers (userId, amount, createdAt) VALUES (?, ?, ?)",
                [user.id, money.amount, user.registeredAt],
            );

            for (let i = 0; i < user.todo.length; i++) {
                await db.query("INSERT INTO Todos (userId, string) VALUES (?, ?)",
                    [res.insertId, user.todo[i]],
                );
            }

            // for (let i = 0; i < user.userNicknames.length; i++) {
            //     await db.query("INSERT INTO UserNicknames (nickname, guildUserId) VALUES (?, ?)", [user.userNicknames[i] ]);
            // }
        }
    },
});
