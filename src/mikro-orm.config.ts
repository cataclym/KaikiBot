import { Configuration } from "@mikro-orm/core";
import { BlockedCategories } from "./struct/entities/BlockedCategories";
import { BotSettings } from "./struct/entities/BotSettings";
import { CommandStats } from "./struct/entities/CommandStats";
import { CurrencyTransactions } from "./struct/entities/CurrencyTransactions";
import { DadBotChannels } from "./struct/entities/DadBotChannels";
import { DiscordUsers } from "./struct/entities/DiscordUsers";
// import { EmojiReactions } from "./struct/entities/EmojiReactions";
import { EmojiStats } from "./struct/entities/EmojiStats";
import { Guilds } from "./struct/entities/Guilds";
import { GuildUsers } from "./struct/entities/GuildUsers";
import { LeaveRoles } from "./struct/entities/LeaveRoles";
import { Migrations } from "./struct/entities/Migrations";
import { Todos } from "./struct/entities/Todos";
import { UserNicknames } from "./struct/entities/UserNicknames";
import { MySqlDriver } from "@mikro-orm/mysql";

export default new Configuration<MySqlDriver>({
    dbName: "kaikidb",
    type: "mysql",
    debug: true,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASS || "root",
    entities: [BlockedCategories, BotSettings, CommandStats, CurrencyTransactions, DadBotChannels, DiscordUsers,
        // EmojiReactions,
        EmojiStats, Guilds, GuildUsers, LeaveRoles, Migrations, Todos, UserNicknames ],
});
