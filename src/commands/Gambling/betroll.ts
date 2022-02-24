import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";

export default class BetRollCommand extends KaikiCommand {
    constructor() {
        super("betroll", {
            aliases: ["betroll", "br"],
            description: "Bet an amount of currency and roll the dice. Rolling above 66 yields x2 the amount bet. Above 90 - x4 and 100 gives x10!",
            usage: "69",
            args: [{
                id: "number",
                type: "integer",
                otherwise: (m) => ({
                    embeds: [new MessageEmbed()
                        .setDescription("Please provide an amount to bet!")
                        .withErrorColor(m)],
                }),
            }],
        });
    }

    public async exec(message: Message, { number }: { number: number }): Promise<Message> {
        const success = await this.client.money.TryTake(message.author.id, number, "Betroll gamble");

        if (!success) {
            return await message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`You don't have enough ${this.client.money.currencySymbol}`)
                    .withErrorColor(message)],
            });
        }

        // Gives a random number between 0-100
        const roll = Math.round(Math.random() * 100);

        if (roll < 66) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`🎲 You rolled \`${roll}\`. Better luck next time!`)
                    .withOkColor(message)],
            });
        }

        else if (roll < 90) {

            const winnings = Math.round(number * 2);

            await this.client.money.Add(message.author.id, winnings, "Betroll won x2");

            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`🎲 You rolled \`${roll}\`, and won ${winnings} ${this.client.money.currencySymbol}, for rolling above 66`)
                    .withOkColor(message)],
            });
        }

        else if (roll < 100) {

            const winnings = Math.round(number * 4);

            await this.client.money.Add(message.author.id, winnings, "Betroll won x4");

            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`🎲 You rolled \`${roll}\`, and won ${winnings} ${this.client.money.currencySymbol}, for rolling above 90`)
                    .withOkColor(message)],
            });
        }

        else {

            const winnings = Math.round(number * 10);

            await this.client.money.Add(message.author.id, winnings, "Betroll won x10");

            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`🎲 You rolled \`${roll}\`!!! You won ${winnings} ${this.client.money.currencySymbol}, for rolling above 99`)
                    .withOkColor(message)],
            });
        }
    }
}
