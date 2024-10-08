import { ApplyOptions } from "@sapphire/decorators";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, time } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/Kaiki/KaikiEmbeds";
import KaikiUtil from "../../lib/KaikiUtil";
import Gambling from "../../lib/Gambling/Gambling";

@ApplyOptions<KaikiCommandOptions>({
    name: "daily",
    usage: "",
    description: "Claim your daily currency allowance",
})
export default class ClaimDailyCommand extends KaikiCommand {
    public async messageRun(message: Message) {
        const enabled = this.client.botSettings.get("1", "DailyEnabled", false);

        if (!enabled) {
            return message.reply({
                embeds: [
                    await KaikiEmbeds.errorMessage(
                        message,
                        "A daily amount has not been set by the bot owner!"
                    ),
                ],
            });
        }

        const amount = this.client.botSettings.get("1", "DailyAmount", 250);

        if (
            !(await this.client.orm.discordUsers.findUnique({
                where: {
                    UserId: BigInt(message.author.id),
                },
            }))
        ) {
            await this.client.orm.discordUsers.create({
                data: {
                    UserId: BigInt(message.author.id),
                },
            });
        }

        const gambling = new Gambling(message.author);
        const button = gambling.createDailyReminder();
        const actionRow = [new ActionRowBuilder<ButtonBuilder>().setComponents(button)];

        if (
            !(await this.client.cache.dailyProvider.hasClaimedDaily(
                message.author.id
            ))
        ) {
            await this.client.cache.dailyProvider.setClaimed(message.author.id);
            await this.client.money.add(
                message.author.id,
                BigInt(amount),
                "Claimed daily"
            );

            return message.reply({
                components: actionRow,
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${message.author.username}**, You've just claimed your daily allowance!\n+**${amount}** ${this.client.money.currencyName} ${this.client.money.currencySymbol}\n\nClaim again ${time(new Date(new Date().getTime() + KaikiUtil.timeToMidnightOrNoon()), "R")}`
                        )
                        .withOkColor(message),
                ],
            }).then(msg => gambling.handleReminder(msg));
        } else {
            return message.reply({
                components: actionRow,
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**${message.author.username}**, You've already claimed your daily allowance!!\n\nClaim again ${time(new Date(new Date().getTime() + KaikiUtil.timeToMidnightOrNoon()), "R")}`
                        )
                        .withErrorColor(message),
                ],
            }).then(msg => gambling.handleReminder(msg));
        }
    }
}
