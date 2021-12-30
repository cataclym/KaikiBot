import { GuildFeatures } from "discord.js";

export const dadbotArray = ["i'm ", "im ", "i am ", "i’m "];

export const badWords = ["shit", "fuck", "stop", "dont", "kill", "don't", "don`t", "fucking", "shut", "shutup", "shuttup", "trash", "bad", "hate", "stupid", "dumb", "suck", "sucks"];

export const AnniversaryStrings = {
    roleNameJoin: "Join Anniversary",
    roleNameCreated: "Cake Day",
};

export const EMOTE_REGEX = /<(a?)((!?\d+)|(:.+?:\d+))>/g;
export const IMAGE_REGEX = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/gi;
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

export const tableQueries = {
    _Migrations: "CREATE TABLE IF NOT EXISTS `_Migrations` (`migrationId` VARCHAR(255) NOT NULL UNIQUE , `versionString` VARCHAR(255) NOT NULL, PRIMARY KEY (`migrationId`)) ENGINE=InnoDB;",
    BotSettings: "CREATE TABLE IF NOT EXISTS `BotSettings` (`id` enum('1') NOT NULL, `activity` VARCHAR(255) DEFAULT NULL, `activityType` VARCHAR(255) DEFAULT NULL, `currencyName` VARCHAR(255) DEFAULT 'Yen', `currencySymbol` VARCHAR(255) DEFAULT N'U+1F4B4', `dailyEnabled` TINYINT(1) DEFAULT false, `dailyAmount` BIGINT UNSIGNED DEFAULT 250, PRIMARY KEY (`id`)) ENGINE=InnoDB; ",
    DiscordUsers: "CREATE TABLE IF NOT EXISTS `DiscordUsers` (`id` INTEGER UNSIGNED NOT NULL auto_increment , `userId` VARCHAR(255) NOT NULL UNIQUE, `amount` BIGINT UNSIGNED DEFAULT 0, `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`)) ENGINE=InnoDB; ",
    CommandStats: "CREATE TABLE IF NOT EXISTS `CommandStats` (`commandAlias` VARCHAR(255) NOT NULL UNIQUE , `count` INTEGER UNSIGNED DEFAULT 0, `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`commandAlias`)) ENGINE=InnoDB; ",
    Guilds: "CREATE TABLE IF NOT EXISTS `Guilds` (`id` INTEGER UNSIGNED NOT NULL UNIQUE , `prefix` VARCHAR(255) NOT NULL, `anniversary` TINYINT(1) DEFAULT false, `dadbot` TINYINT(1) DEFAULT true, `errorColor` INTEGER NOT NULL, `okColor` INTEGER NOT NULL, `excludeRole` VARCHAR(255), `welcomeChannel` INTEGER UNSIGNED, `byeChannel` INTEGER UNSIGNED, `welcomeMessage` MEDIUMTEXT, `byeMessage` MEDIUMTEXT, `stickyRoles` TINYINT(1) DEFAULT false, `createdAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB; ",
    GuildUsers: "CREATE TABLE IF NOT EXISTS `GuildUsers` (`id` INTEGER UNSIGNED NOT NULL auto_increment , `userId` INTEGER UNSIGNED NOT NULL , `userRole` INTEGER UNSIGNED, `guildId` INTEGER UNSIGNED NOT NULL, `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`, `userId`), FOREIGN KEY (`guildId`) REFERENCES `Guilds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
    DadbotChannels: "CREATE TABLE IF NOT EXISTS `DadbotChannels` (`channelId` INTEGER UNSIGNED NOT NULL, `guildId` INTEGER UNSIGNED NOT NULL, PRIMARY KEY (`channelId`), FOREIGN KEY (`guildId`) REFERENCES `Guilds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
    EmojiReactions: "CREATE TABLE IF NOT EXISTS `EmojiReactions` (`id` INTEGER auto_increment , `emojiId` INTEGER UNSIGNED NOT NULL NOT NULL, `triggerString` VARCHAR(255) NOT NULL, `guildId` INTEGER UNSIGNED NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`guildId`) REFERENCES `Guilds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
    EmojiStats: "CREATE TABLE IF NOT EXISTS `EmojiStats` (`emojiId` INTEGER UNSIGNED NOT NULL , `count` INTEGER NOT NULL, `guildId` INTEGER UNSIGNED NOT NULL, PRIMARY KEY (`emojiId`), FOREIGN KEY (`guildId`) REFERENCES `Guilds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
    LeaveRoles: "CREATE TABLE IF NOT EXISTS `LeaveRoles` (`id` INTEGER UNSIGNED NOT NULL auto_increment , `roleId` INTEGER UNSIGNED NOT NULL, `GuildUserId` INTEGER UNSIGNED, PRIMARY KEY (`id`), FOREIGN KEY (`GuildUserId`) REFERENCES `GuildUsers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
    Todos: "CREATE TABLE IF NOT EXISTS `Todos` (`id` INTEGER UNSIGNED NOT NULL auto_increment, `userId` INTEGER UNSIGNED, `string` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`userId`) REFERENCES `DiscordUsers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
    UserNicknames: "CREATE TABLE IF NOT EXISTS `UserNicknames` (`id` INTEGER UNSIGNED NOT NULL auto_increment , `nickname` VARCHAR(255) NOT NULL, `GuildUserId` INTEGER UNSIGNED, PRIMARY KEY (`id`), FOREIGN KEY (`GuildUserId`) REFERENCES `GuildUsers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;",
    BlockedCategories: "CREATE TABLE IF NOT EXISTS `BlockedCategories` (`id` INTEGER UNSIGNED NOT NULL auto_increment, `guildId` INTEGER UNSIGNED NOT NULL, `Administration` TINYINT(1) DEFAULT false, `Anime` TINYINT(1) DEFAULT false, `Emotes` TINYINT(1) DEFAULT false, `Fun` TINYINT(1) DEFAULT false, `Gambling` TINYINT(1) DEFAULT false, `NSFW` TINYINT(1) DEFAULT false, `Owner only` TINYINT(1) DEFAULT false, `Reactions` TINYINT(1) DEFAULT false, `Roles` TINYINT(1) DEFAULT false, `Server settings` TINYINT(1) DEFAULT false, `Utility` TINYINT(1) DEFAULT false, PRIMARY KEY (`id`), FOREIGN KEY (`guildId`) REFERENCES `Guilds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB; ",
};
