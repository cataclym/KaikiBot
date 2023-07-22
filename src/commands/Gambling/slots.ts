import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import Gambling from "../../lib/Gambling/Gambling";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "Slots",
    aliases: ["slots", "slot"],
    description: "Bet a certain amount in the slot machine.",
    usage: ["69"],
})
export default class SlotsCommand extends KaikiCommand {

    public async messageRun(message: Message, args: Args): Promise<void> {

        const amount = await args.rest("kaikiMoney");

        if (amount < 2) {
            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`You need to bet more than 2 ${this.client.money.currencySymbol}`)
                        .withErrorColor(message),
                ],
            });
            return;
        }

        const success = await this.client.money.tryTake(message.author.id, amount, "Slots gamble");

        if (!success) {
            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`You have less than ${amount} ${this.client.money.currencySymbol}`)
                        .withErrorColor(message),
                ],
            });
            return;
        }

        const result = await Gambling.playSlots(this.client.money.currencySymbol);

        // Check if all three indexes are the same before we check if there are 2 similar ones
        if (result.numbers.every((val, i, arr) => val === arr[0])) {
            const winAmount = amount * 30n;
            await this.client.money.add(message.author.id, winAmount, "Slots won x30");
            result.string += `\n\nYou won ${winAmount} ${this.client.money.currencySymbol}!`;
        }

        // check for two similar indexes
        else if (result.numbers.some((r, i, arr) => {
            arr.splice(i, 1);
            if (arr.includes(r)) return true;
        })) {
            const winAmount = amount * 10n;
            await this.client.money.add(message.author.id, winAmount, "Slots won x10");
            result.string += `\n\nYou won **${winAmount}** ${this.client.money.currencySymbol}!`;
        }

        else {
            result.string += "\n\nYou won nothing\ntry again ^_^";
        }

        await message.channel.send((await Gambling.playSlots(this.client.money.currencySymbol)).string)
            .then(async m => {
                setTimeout(async () => m.edit((await Gambling.playSlots(this.client.money.currencySymbol)).string), Constants.MAGIC_NUMBERS.CMDS.GAMBLING.SLOTS.EDIT_AFTER_1_SEC);
                setTimeout(async () => m.edit(result.string), Constants.MAGIC_NUMBERS.CMDS.GAMBLING.SLOTS.EDIT_AFTER_2_SEC);
            });
    }
}
