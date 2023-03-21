import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

@ApplyOptions<KaikiCommandOptions>({
    name: "daily",
    description: "Claim your daily currency allowance",
})
export default class ClaimDailyCommand extends KaikiCommand {

    public async messageRun(message: Message) {

        const enabled = this.client.botSettings.get("1", "DailyEnabled", false);

        if (!enabled) {
            return message.channel.send({ embeds: [await KaikiEmbeds.errorMessage(message, "A daily amount has not been set by the bot owner!")] });
        }

        const amount = this.client.botSettings.get("1", "DailyAmount", 250);

        if (!(await this.client.orm.discordUsers.findUnique({
            where: {
                UserId: BigInt(message.author.id),
            },
        }))) {
            await this.client.orm.discordUsers.create({
                data: {
                    UserId: BigInt(message.author.id),
                },
            });
        }

        if (!await this.client.cache.dailyProvider.checkClaimed(message.author.id)) {

            await this.client.cache.dailyProvider.setClaimed(message.author.id);
            await this.client.money.Add(message.author.id, BigInt(amount), "Claimed daily");

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**${message.author.tag}**, You've just claimed your daily allowance!\n**${amount}** ${this.client.money.currencyName} ${this.client.money.currencySymbol}`)
                        .withOkColor(message),
                ],
            });
        }

        else {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**${message.author.tag}**, You've already claimed your daily allowance!!`)
                        .withErrorColor(message),
                ],
            });
        }
    }
}
