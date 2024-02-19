-- CreateTable
CREATE TABLE `BlockedCategories`
(
    `Id`             INTEGER NOT NULL AUTO_INCREMENT,
    `GuildId`        BIGINT  NOT NULL,
    `CategoryTarget` INTEGER NOT NULL,

    INDEX `GuildId` (`GuildId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BotSettings`
(
    `Id`             INTEGER                                                             NOT NULL,
    `Activity`       VARCHAR(255)                                                        NULL,
    `ActivityType`   ENUM ('PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'COMPETING') NULL,
    `CurrencyName`   VARCHAR(255)                                                        NOT NULL DEFAULT 'Yen',
    `CurrencySymbol` INTEGER                                                             NOT NULL DEFAULT 128180,
    `DailyEnabled`   BOOLEAN                                                             NOT NULL DEFAULT false,
    `DailyAmount`    BIGINT                                                              NOT NULL DEFAULT 250,

    UNIQUE INDEX `BotSettings_Id_key` (`Id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommandStats`
(
    `CommandAlias` VARCHAR(255) NOT NULL,
    `Count`        INTEGER      NOT NULL DEFAULT 0,
    `CreatedAt`    TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `CommandAlias` (`CommandAlias`),
    PRIMARY KEY (`CommandAlias`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CurrencyTransactions`
(
    `Id`        BIGINT       NOT NULL AUTO_INCREMENT,
    `Amount`    BIGINT       NOT NULL,
    `Reason`    TEXT         NOT NULL,
    `UserId`    BIGINT       NOT NULL,
    `DateAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DadBotChannels`
(
    `ChannelId` BIGINT NOT NULL,
    `GuildId`   BIGINT NOT NULL,

    INDEX `GuildId` (`GuildId`),
    PRIMARY KEY (`ChannelId`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExcludedStickyRoles`
(
    `RoleId`  BIGINT NOT NULL,
    `GuildId` BIGINT NOT NULL,

    INDEX `GuildId` (`GuildId`),
    PRIMARY KEY (`RoleId`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiscordUsers`
(
    `UserId`       BIGINT       NOT NULL,
    `Amount`       BIGINT       NOT NULL DEFAULT 0,
    `ClaimedDaily` BOOLEAN      NOT NULL DEFAULT false,
    `CreatedAt`    TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `UserId` (`UserId`),
    PRIMARY KEY (`UserId`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmojiReactions`
(
    `Id`            BIGINT       NOT NULL AUTO_INCREMENT,
    `EmojiId`       BIGINT       NOT NULL,
    `TriggerString` VARCHAR(255) NOT NULL,
    `GuildId`       BIGINT       NOT NULL,

    INDEX `GuildId` (`GuildId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmojiStats`
(
    `EmojiId` BIGINT NOT NULL,
    `Count`   BIGINT NOT NULL,
    `GuildId` BIGINT NOT NULL,

    INDEX `GuildId` (`GuildId`),
    PRIMARY KEY (`EmojiId`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildUsers`
(
    `UserId`    BIGINT       NOT NULL,
    `UserRole`  BIGINT       NULL,
    `GuildId`   BIGINT       NOT NULL,
    `CreatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `GuildId` (`GuildId`),
    PRIMARY KEY (`UserId`, `GuildId`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guilds`
(
    `Id`             BIGINT       NOT NULL,
    `Prefix`         VARCHAR(50)  NOT NULL,
    `Anniversary`    BOOLEAN      NOT NULL DEFAULT false,
    `DadBot`         BOOLEAN      NOT NULL DEFAULT false,
    `ErrorColor`     BIGINT       NOT NULL DEFAULT 16711680,
    `OkColor`        BIGINT       NOT NULL DEFAULT 65280,
    `ExcludeRole`    BIGINT       NULL,
    `WelcomeChannel` BIGINT       NULL,
    `ByeChannel`     BIGINT       NULL,
    `WelcomeMessage` MEDIUMTEXT   NULL,
    `ByeMessage`     MEDIUMTEXT   NULL,
    `WelcomeTimeout` INTEGER      NULL,
    `ByeTimeout`     INTEGER      NULL,
    `StickyRoles`    BOOLEAN      NOT NULL DEFAULT false,
    `CreatedAt`      TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaveRoles`
(
    `Id`          BIGINT NOT NULL AUTO_INCREMENT,
    `RoleId`      BIGINT NOT NULL,
    `GuildUserId` BIGINT NOT NULL,
    `GuildId`     BIGINT NOT NULL,

    INDEX `GuildUserId` (`GuildUserId`),
    INDEX `GuildId` (`GuildId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Todos`
(
    `Id`     BIGINT       NOT NULL AUTO_INCREMENT,
    `UserId` BIGINT       NOT NULL,
    `String` VARCHAR(255) NOT NULL,

    INDEX `UserId` (`UserId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserNicknames`
(
    `Id`          BIGINT       NOT NULL AUTO_INCREMENT,
    `Nickname`    VARCHAR(255) NOT NULL,
    `GuildUserId` BIGINT       NOT NULL,
    `GuildId`     BIGINT       NOT NULL,

    INDEX `GuildUserId` (`GuildUserId`),
    INDEX `GuildId` (`GuildId`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Migrations`
(
    `MigrationId`   VARCHAR(255) NOT NULL,
    `VersionString` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `MigrationId` (`MigrationId`),
    PRIMARY KEY (`MigrationId`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BlockedCategories`
    ADD CONSTRAINT `BlockedCategories_ibfk_1` FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DadBotChannels`
    ADD CONSTRAINT `DadBotChannels_ibfk_1` FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExcludedStickyRoles`
    ADD CONSTRAINT `ExcludedStickyRoles_ibfk_1` FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmojiReactions`
    ADD CONSTRAINT `EmojiReactions_ibfk_1` FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmojiStats`
    ADD CONSTRAINT `EmojiStats_ibfk_1` FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildUsers`
    ADD CONSTRAINT `GuildUsers_ibfk_1` FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveRoles`
    ADD CONSTRAINT `LeaveRoles_ibfk_1` FOREIGN KEY (`GuildUserId`, `GuildId`) REFERENCES `GuildUsers` (`UserId`, `GuildId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todos`
    ADD CONSTRAINT `Todos_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `DiscordUsers` (`UserId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserNicknames`
    ADD CONSTRAINT `UserNicknames_ibfk_1` FOREIGN KEY (`GuildUserId`, `GuildId`) REFERENCES `GuildUsers` (`UserId`, `GuildId`) ON DELETE CASCADE ON UPDATE CASCADE;
