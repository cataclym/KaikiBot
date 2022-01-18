CREATE DATABASE IF NOT EXISTS kaikidb;

USE kaikidb;

CREATE TABLE IF NOT EXISTS `_Migrations`
(
    `MigrationId`   VARCHAR(255) NOT NULL UNIQUE,
    `VersionString` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`MigrationId`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `BotSettings`
(
    `Id`             enum ('1')   NOT NULL,
    `Activity`       VARCHAR(255)                                                        DEFAULT NULL,
    `ActivityType`   ENUM ('PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'COMPETING') DEFAULT NULL,
    `CurrencyName`   VARCHAR(255) NOT NULL                                               DEFAULT 'Yen',
    `CurrencySymbol` INT          NOT NULL                                               DEFAULT 128180,
    `DailyEnabled`   TINYINT(1)                                                          DEFAULT FALSE,
    `DailyAmount`    BIGINT                                                              DEFAULT 250,
    PRIMARY KEY (`Id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `DiscordUsers`
(
    `Id`        BIGINT    NOT NULL AUTO_INCREMENT,
    `UserId`    BIGINT    NOT NULL UNIQUE,
    `Amount`    BIGINT    NOT NULL DEFAULT 0,
    `CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `CommandStats`
(
    `CommandAlias` VARCHAR(255) NOT NULL UNIQUE,
    `Count`        BIGINT                DEFAULT 0,
    `CreatedAt`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`CommandAlias`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS CurrencyTransactions
(
    `Id`        BIGINT    NOT NULL AUTO_INCREMENT,
    `Amount`    BIGINT    NOT NULL,
    `Reason`    TEXT      NOT NULL,
    `UserId`    BIGINT    NOT NULL,
    `DateAdded` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Guilds`
(
    `Id`             BIGINT       NOT NULL UNIQUE,
    `Prefix`         VARCHAR(255) NOT NULL,
    `Anniversary`    TINYINT(1) DEFAULT FALSE,
    `DadBot`         TINYINT(1) DEFAULT TRUE,
    `ErrorColor`     BIGINT       NOT NULL,
    `OkColor`        BIGINT       NOT NULL,
    `ExcludeRole`    VARCHAR(255),
    `WelcomeChannel` BIGINT,
    `ByeChannel`     BIGINT,
    `WelcomeMessage` MEDIUMTEXT,
    `ByeMessage`     MEDIUMTEXT,
    `StickyRoles`    TINYINT(1) DEFAULT FALSE,
    `CreatedAt`      DATETIME     NOT NULL,
    PRIMARY KEY (`Id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `GuildUsers`
(
    `Id`        BIGINT    NOT NULL AUTO_INCREMENT,
    `UserId`    BIGINT    NOT NULL,
    `UserRole`  BIGINT,
    `GuildId`   BIGINT    NOT NULL,
    `CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`, `UserId`),
    FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `DadBotChannels`
(
    `ChannelId` BIGINT NOT NULL,
    `GuildId`   BIGINT NOT NULL,
    PRIMARY KEY (`ChannelId`),
    FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `EmojiReactions`
(
    `Id`            BIGINT AUTO_INCREMENT,
    `EmojiId`       BIGINT       NOT NULL NOT NULL,
    `TriggerString` VARCHAR(255) NOT NULL,
    `GuildId`       BIGINT       NOT NULL,
    PRIMARY KEY (`Id`),
    FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `EmojiStats`
(
    `EmojiId` BIGINT NOT NULL,
    `Count`   BIGINT NOT NULL,
    `GuildId` BIGINT NOT NULL,
    PRIMARY KEY (`EmojiId`),
    FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `LeaveRoles`
(
    `Id`          BIGINT NOT NULL AUTO_INCREMENT,
    `RoleId`      BIGINT NOT NULL,
    `GuildUserId` BIGINT,
    PRIMARY KEY (`Id`),
    FOREIGN KEY (`GuildUserId`) REFERENCES `GuildUsers` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Todos`
(
    `Id`     BIGINT       NOT NULL AUTO_INCREMENT,
    `UserId` BIGINT,
    `String` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`Id`),
    FOREIGN KEY (`UserId`) REFERENCES `DiscordUsers` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `UserNicknames`
(
    `Id`          BIGINT       NOT NULL AUTO_INCREMENT,
    `Nickname`    VARCHAR(255) NOT NULL,
    `GuildUserId` BIGINT,
    PRIMARY KEY (`Id`),
    FOREIGN KEY (`GuildUserId`) REFERENCES `GuildUsers` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `BlockedCategories`
(
    `Id`             BIGINT NOT NULL AUTO_INCREMENT,
    `GuildId`        BIGINT NOT NULL,
    `CategoryTarget` BIGINT NOT NULL,
    PRIMARY KEY (`Id`),
    FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `DailyRewards`
(
    `Id`             BIGINT NOT NULL AUTO_INCREMENT,
    `DateAdded`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
