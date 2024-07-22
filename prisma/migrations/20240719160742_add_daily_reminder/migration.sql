-- AlterTable
ALTER TABLE `BotSettings` MODIFY `CurrencySymbol` VARCHAR(255) NOT NULL DEFAULT '💴';

-- AlterTable
ALTER TABLE `DiscordUsers` ADD COLUMN `DailyReminder` DATETIME(3) NULL;
