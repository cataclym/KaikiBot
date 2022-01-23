import { GuildFeatures } from "discord.js";

export const dadbotArray = ["i'm ", "im ", "i am ", "i’m "];

export const badWords = ["shit", "fuck", "stop", "dont", "kill", "don't", "don`t", "fucking", "shut", "shutup", "shuttup", "trash", "bad", "hate", "stupid", "dumb", "suck", "sucks"];

export const AnniversaryStrings = {
    roleNameJoin: "Join Anniversary",
    roleNameCreated: "Cake Day",
};

export const EMOTE_REGEX = /<(a?)((!?\d+)|(:.+?:\d+))>/g;
export const IMAGE_REGEX = /(http(s?):)([/|.\w\s-])*\.(?:jpg|gif|png|jpeg)/gi;
// Credit to https://github.com/Snitt/emojibotten/blob/master/commands/management/emoji.js

type theseDoNotYetExist = "MEMBER_PROFILES"
  | "NEW_THREAD_PERMISSIONS"
  | "THREADS_ENABLED";

export const guildFeatures: { [index in GuildFeatures]: string } & { [index in theseDoNotYetExist]: string } = {
    ANIMATED_ICON: "Animated icon",
    BANNER: "Banner",
    COMMERCE: "Commerce",
    COMMUNITY: "Community",
    DISCOVERABLE: "Discoverable",
    FEATURABLE: "Can be featured",
    INVITE_SPLASH: "Invite splash",
    MEMBER_VERIFICATION_GATE_ENABLED: "Member verification enabled",
    MONETIZATION_ENABLED: "Monetization enabled",
    MORE_STICKERS: "More stickers",
    NEWS: "News",
    PARTNERED: "Partnered",
    PREVIEW_ENABLED: "Preview enabled",
    PRIVATE_THREADS: "Private threads",
    ROLE_ICONS: "Role icons",
    SEVEN_DAY_THREAD_ARCHIVE: "Seven day thread archive",
    THREE_DAY_THREAD_ARCHIVE: "Three day thread archive",
    TICKETED_EVENTS_ENABLED: "Ticketed events enabled",
    VANITY_URL: "Vanity URL",
    VERIFIED: "Verified",
    VIP_REGIONS: "VIP Regions",
    WELCOME_SCREEN_ENABLED: "Welcome screen enabled",
    MEMBER_PROFILES: "Member profiles",
    NEW_THREAD_PERMISSIONS: "New thread permissions",
    THREADS_ENABLED: "Threads enabled",
};

export enum blockedCategories {
    Administration,
    Anime,
    Emotes,
    Fun,
    Gambling,
    Moderation,
    NSFW,
    "Owner only",
    Reactions,
    Roles,
    "Server settings",
    Utility,
}

export const tableQueries = {
    _Migrations: "CREATE TABLE IF NOT EXISTS `_Migrations` (`MigrationId` VARCHAR(255) NOT NULL UNIQUE , `VersionString` VARCHAR(255) NOT NULL, PRIMARY KEY (`MigrationId`)) ENGINE=InnoDB;",
    BotSettings: "CREATE TABLE IF NOT EXISTS `BotSettings` (`Id` enum('1') NOT NULL, `Activity` VARCHAR(255) DEFAULT NULL, `ActivityType` ENUM ('PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'COMPETING') DEFAULT NULL, `CurrencyName` VARCHAR(255) DEFAULT 'Yen', `CurrencySymbol` BIGINT DEFAULT 128180, `DailyEnabled` TINYINT(1) DEFAULT false, `DailyAmount` BIGINT DEFAULT 250, PRIMARY KEY (`Id`)) ENGINE=InnoDB; ",
    DiscordUsers: "CREATE TABLE IF NOT EXISTS `DiscordUsers` (`Id` BIGINT NOT NULL auto_increment , `UserId` BIGINT NOT NULL UNIQUE, `Amount` BIGINT DEFAULT 0, `CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`Id`)) ENGINE=InnoDB; ",
    CommandStats: "CREATE TABLE IF NOT EXISTS `CommandStats` (`CommandAlias` VARCHAR(255) NOT NULL UNIQUE , `Count` BIGINT DEFAULT 0, `CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`CommandAlias`)) ENGINE=InnoDB; ",
    CurrencyTransactions: "create table CurrencyTransactions (`Id` BIGINT NULL, `Amount` BIGINT NULL, `Reason` TEXT NULL, `UserId` BIGINT NULL, `DateAdded` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);",
    Guilds: "CREATE TABLE IF NOT EXISTS `Guilds` (`Id` BIGINT NOT NULL UNIQUE , `Prefix` VARCHAR(255) NOT NULL, `Anniversary` TINYINT(1) DEFAULT false, `DadBot` TINYINT(1) DEFAULT true, `ErrorColor` BIGINT NOT NULL, `OkColor` BIGINT NOT NULL, `ExcludeRole` VARCHAR(255), `WelcomeChannel` BIGINT, `ByeChannel` BIGINT, `WelcomeMessage` MEDIUMTEXT, `ByeMessage` MEDIUMTEXT, `StickyRoles` TINYINT(1) DEFAULT false, `CreatedAt` DATETIME NOT NULL, PRIMARY KEY (`Id`)) ENGINE=InnoDB; ",
    GuildUsers: "CREATE TABLE IF NOT EXISTS `GuildUsers` (`Id` BIGINT NOT NULL auto_increment , `UserId` BIGINT NOT NULL , `UserRole` BIGINT, `GuildId` BIGINT NOT NULL, `CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`Id`, `UserId`), FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
    DadbotChannels: "CREATE TABLE IF NOT EXISTS `DadbotChannels` (`ChannelId` BIGINT NOT NULL, `GuildId` BIGINT NOT NULL, PRIMARY KEY (`ChannelId`), FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
    EmojiReactions: "CREATE TABLE IF NOT EXISTS `EmojiReactions` (`Id` BIGINT auto_increment , `EmojiId` BIGINT NOT NULL NOT NULL, `TriggerString` VARCHAR(255) NOT NULL, `GuildId` BIGINT NOT NULL, PRIMARY KEY (`Id`), FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
    EmojiStats: "CREATE TABLE IF NOT EXISTS `EmojiStats` (`EmojiId` BIGINT NOT NULL , `Count` BIGINT NOT NULL, `GuildId` BIGINT NOT NULL, PRIMARY KEY (`EmojiId`), FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
    LeaveRoles: "CREATE TABLE IF NOT EXISTS `LeaveRoles` (`Id` BIGINT NOT NULL auto_increment , `RoleId` BIGINT NOT NULL, `GuildUserId` BIGINT, PRIMARY KEY (`Id`), FOREIGN KEY (`GuildUserId`) REFERENCES `GuildUsers` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
    Todos: "CREATE TABLE IF NOT EXISTS `Todos` (`Id` BIGINT NOT NULL auto_increment, `UserId` BIGINT, `String` VARCHAR(255) NOT NULL, PRIMARY KEY (`Id`), FOREIGN KEY (`UserId`) REFERENCES `DiscordUsers` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
    UserNicknames: "CREATE TABLE IF NOT EXISTS `UserNicknames` (`Id` BIGINT NOT NULL auto_increment , `Nickname` VARCHAR(255) NOT NULL, `GuildUserId` BIGINT, PRIMARY KEY (`Id`), FOREIGN KEY (`GuildUserId`) REFERENCES `GuildUsers` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;",
    BlockedCategories: "CREATE TABLE IF NOT EXISTS `BlockedCategories` (`Id` BIGINT NOT NULL auto_increment, `GuildId` BIGINT NOT NULL, `CategoryTarget` BIGINT NOT NULL, PRIMARY KEY (`Id`), FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
};
