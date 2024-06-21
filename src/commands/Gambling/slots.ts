import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import Gambling from "../../lib/Gambling/Gambling";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";
import { container } from "@sapphire/pieces";

export enum Slots {
	x0,
	x10,
	x30,
}

export type SlotResult = { string: string; numbers: string[] };

@ApplyOptions<KaikiCommandOptions>({
    name: "Slots",
    aliases: ["slots", "slot"],
    description: "Bet a certain amount in the slot machine.",
    usage: ["69"],
})
export default class SlotsCommand extends KaikiCommand {
    static async run(amount = 100n): Promise<[Slots, SlotResult, bigint]> {
        const result = await Gambling.playSlots(
            container.client.money.currencySymbol
        );
        // Check if all three indexes are the same before we check if there are 2 similar ones
        if (result.numbers.every((val, _i, arr) => val === arr[0])) {
            const winAmount = amount * 30n;
            return [Slots.x30, result, winAmount];
        } else if (
            result.numbers.some((r, i, arr) => {
                arr.splice(i, 1);
                return arr.includes(r);
            })
        ) {
            const winAmount = amount * 10n;
            return [Slots.x10, result, winAmount];
        }

        return [Slots.x0, result, 0n];
    }

    public async messageRun(message: Message, args: Args): Promise<void> {
        const amount = await args.rest("kaikiMoney");

        if (amount < 2) {
            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `You need to bet at least 2 ${this.client.money.currencySymbol}`
                        )
                        .withErrorColor(message),
                ],
            });
            return;
        }

        const success = await this.client.money.tryTake(
            message.author.id,
            amount,
            "Slots gamble"
        );

        if (!success) {
            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `You have less than ${amount} ${this.client.money.currencySymbol}`
                        )
                        .withErrorColor(message),
                ],
            });
            return;
        }

        const [slots, result, winAmount] = await SlotsCommand.run(amount);

        switch (slots) {
        case Slots.x0:
            result.string += "\n\nYou won nothing\ntry again ^_^";
            break;
        case Slots.x10:
            await this.client.money.add(
                message.author.id,
                winAmount,
                "Slots won x10"
            );
            result.string += `\n\nYou won **${winAmount}** ${this.client.money.currencySymbol}!`;
            break;
        case Slots.x30:
            await this.client.money.add(
                message.author.id,
                winAmount,
                "Slots won x30"
            )
            result.string += `\n\nYou won ${winAmount} ${this.client.money.currencySymbol}!`;
            break;
        }

        await message.channel.send((await Gambling.playSlots(this.client.money.currencySymbol)).string)
            .then(async (m) => {
                setTimeout(async () => m.edit((await Gambling.playSlots(this.client.money.currencySymbol)).string),
                    Constants.MAGIC_NUMBERS.CMDS.GAMBLING.SLOTS.EDIT_AFTER_1_SEC
                );
                setTimeout(async () => m.edit(result.string),
                    Constants.MAGIC_NUMBERS.CMDS.GAMBLING.SLOTS.EDIT_AFTER_2_SEC
                );
            });
    }
}
