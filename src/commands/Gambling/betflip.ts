import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import images from "../../data/images.json";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export enum Sides {
    tails = "tails",
    heads = "heads",
}

@ApplyOptions<KaikiCommandOptions>({
    name: "betflip",
    aliases: ["bf"],
    description:
        "Bet on tails or heads. Guessing correct awards you 1.95x the currency you've bet.",
    usage: ["5 heads", "10 t"],
})
export default class BetflipCommand extends KaikiCommand {
    static RandomFlip = (): Sides =>
        Math.random() < 0.5 ? Sides.tails : Sides.heads;

    static async flip(
        side = BetflipCommand.RandomFlip(),
        amount = 100n
    ): Promise<[Sides, bigint]> {
        const coinFlipped: Sides = BetflipCommand.RandomFlip();

        if (side === coinFlipped) {
            return [
                coinFlipped,
                BigInt(Math.round(parseInt(amount.toString()) * 1.95)),
            ];
        }

        return [coinFlipped, 0n];
    }

    public async messageRun(message: Message, args: Args): Promise<Message> {
        const number = await args.pick("kaikiMoney");
        const coin = await args.rest("kaikiCoin");

        const success = await this.client.money.tryTake(
            message.author.id,
            number,
            "Betflip gamble"
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

        const [coinFlipped, winnings] = await BetflipCommand.flip();

        const emb = new EmbedBuilder({
            image: { url: images.gambling.coin[coinFlipped] },
        }).setTitle(`Flipped ${coinFlipped}!`);

        if (coin === coinFlipped) {
            await this.client.money.add(
                message.author.id,
                winnings,
                "Betflip won x1.95"
            );

            return message.channel.send({
                embeds: [
                    emb
                        .setDescription(
                            `You won **${winnings}** ${this.client.money.currencySymbol}!!`
                        )
                        .withOkColor(message),
                ],
            });
        } else {
            return message.channel.send({
                embeds: [
                    emb
                        .setDescription("You lost, better luck next time")
                        .withOkColor(message),
                ],
            });
        }
    }
}
