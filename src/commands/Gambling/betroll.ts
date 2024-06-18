import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "betroll",
    aliases: ["br"],
    description:
        "Bet an amount of currency and roll the dice. Rolling above 66 yields x2 the amount bet. Above 90 - x4 and 100 gives x10!",
    usage: ["69"],
})
export default class BetRollCommand extends KaikiCommand {
    public static async roll(
        number = 100n
    ): Promise<[BetRoll, number, bigint]> {
        // Gives a random number between 0-100
        const roll = Math.round(Math.random() * 100);

        if (
            roll < Constants.MAGIC_NUMBERS.CMDS.GAMBLING.BET_ROLL.TWO_TIMES_ROLL
        ) {
            return [BetRoll.None, roll, 0n];
        } else if (
            roll <
            Constants.MAGIC_NUMBERS.CMDS.GAMBLING.BET_ROLL.FOUR_TIMES_ROLL
        ) {
            const winnings = number * 2n;

            return [BetRoll.Double, roll, winnings];
        } else if (
            roll < Constants.MAGIC_NUMBERS.CMDS.GAMBLING.BET_ROLL.TEN_TIMES_ROLL
        ) {
            const winnings = number * 4n;

            return [BetRoll.Quadruple, roll, winnings];
        } else {
            const winnings = number * 10n;

            return [BetRoll.Ten, roll, winnings];
        }
    }

    public async messageRun(message: Message, args: Args): Promise<Message> {
        const number = await args.rest("kaikiMoney");

        const success = await this.client.money.tryTake(
            message.author.id,
            number,
            "Betroll gamble"
        );

        if (!success) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `You don't have enough ${this.client.money.currencySymbol}`
                        )
                        .withErrorColor(message),
                ],
            });
        }

        const [bet, roll, winnings] = await BetRollCommand.roll(number);
        let msg: EmbedBuilder;

        switch (bet) {
            case BetRoll.None:
                msg = new EmbedBuilder()
                    .setDescription(
                        `🎲 You rolled \`${roll}\`. Better luck next time!`
                    )
                    .withOkColor(message);
                break;
            case BetRoll.Double:
                await this.client.money.add(
                    message.author.id,
                    winnings,
                    "Betroll won x2"
                );
                msg = new EmbedBuilder()
                    .setDescription(
                        `🎲 You rolled \`${roll}\`, and won **${winnings}** ${this.client.money.currencySymbol}, for rolling above 66`
                    )
                    .withOkColor(message);
                break;
            case BetRoll.Quadruple:
                await this.client.money.add(
                    message.author.id,
                    winnings,
                    "Betroll won x4"
                );
                msg = new EmbedBuilder()
                    .setDescription(
                        `🎲 You rolled \`${roll}\`, and won ${winnings} ${this.client.money.currencySymbol}, for rolling above 90`
                    )
                    .withOkColor(message);
                break;
            case BetRoll.Ten:
                await this.client.money.add(
                    message.author.id,
                    winnings,
                    "Betroll won x10"
                );
                msg = new EmbedBuilder()
                    .setDescription(
                        `🎲 You rolled \`${roll}\`!!! You won ${winnings} ${this.client.money.currencySymbol}, for rolling above 99`
                    )
                    .withOkColor(message);
                break;
        }

        return message.channel.send({ embeds: [msg] });
    }
}

export enum BetRoll {
    None,
    Double,
    Quadruple,
    Ten,
}
