import { EmbedBuilder, Message } from "discord.js";
import KaikiArgumentsTypes from "../../lib/Kaiki/KaikiArgumentsTypes";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

export default class BetRollCommand extends KaikiCommand {
    constructor() {
        super("betroll", {
            aliases: ["betroll", "br"],
            description: "Bet an amount of currency and roll the dice. Rolling above 66 yields x2 the amount bet. Above 90 - x4 and 100 gives x10!",
            usage: "69",
            args: [
                {
                    id: "number",
                    type: KaikiArgumentsTypes.KaikiMoneyArgument,
                    otherwise: (m) => ({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription("Please provide an amount to bet!")
                                .withErrorColor(m),
                        ],
                    }),
                },
            ],
        });
    }

    public async exec(message: Message, { number }: { number: bigint }): Promise<Message> {
        const success = await this.client.money.TryTake(message.author.id, number, "Betroll gamble");

        if (!success) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`You don't have enough ${this.client.money.currencySymbol}`)
                        .withErrorColor(message),
                ],
            });
        }

        // Gives a random number between 0-100
        const roll = Math.round(Math.random() * 100);

        if (roll < Constants.MAGIC_NUMBERS.CMDS.GAMBLING.BET_ROLL.TWO_TIMES_ROLL) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`🎲 You rolled \`${roll}\`. Better luck next time!`)
                        .withOkColor(message),
                ],
            });
        }

        else if (roll < Constants.MAGIC_NUMBERS.CMDS.GAMBLING.BET_ROLL.FOUR_TIMES_ROLL) {

            const winnings = number * 2n;

            await this.client.money.Add(message.author.id, winnings, "Betroll won x2");

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`🎲 You rolled \`${roll}\`, and won **${winnings}** ${this.client.money.currencySymbol}, for rolling above 66`)
                        .withOkColor(message),
                ],
            });
        }

        else if (roll < Constants.MAGIC_NUMBERS.CMDS.GAMBLING.BET_ROLL.TEN_TIMES_ROLL) {

            const winnings = number * 4n;

            await this.client.money.Add(message.author.id, winnings, "Betroll won x4");

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`🎲 You rolled \`${roll}\`, and won ${winnings} ${this.client.money.currencySymbol}, for rolling above 90`)
                        .withOkColor(message),
                ],
            });
        }

        else {

            const winnings = number * 10n;

            await this.client.money.Add(message.author.id, winnings, "Betroll won x10");

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`🎲 You rolled \`${roll}\`!!! You won ${winnings} ${this.client.money.currencySymbol}, for rolling above 99`)
                        .withOkColor(message),
                ],
            });
        }
    }
}
