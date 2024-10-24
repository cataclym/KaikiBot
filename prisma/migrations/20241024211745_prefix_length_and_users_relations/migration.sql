/*
  Warnings:

  - You are about to alter the column `Prefix` on the `Guilds` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE `BotSettings` MODIFY `CurrencySymbol` VARCHAR(255) NOT NULL DEFAULT '💴';

-- AlterTable
ALTER TABLE `Guilds` MODIFY `Prefix` VARCHAR(10) NOT NULL DEFAULT ';';

-- AddForeignKey
ALTER TABLE `CurrencyTransactions` ADD CONSTRAINT `CurrencyTransactions_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `DiscordUsers`(`UserId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildUsers` ADD CONSTRAINT `GuildUsers_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `DiscordUsers`(`UserId`) ON DELETE CASCADE ON UPDATE CASCADE;
