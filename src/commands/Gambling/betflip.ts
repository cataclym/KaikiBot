import { Message, MessageEmbed } from "discord.js";
import images from "../../data/images.json";
import KaikiArgumentsTypes from "../../lib/Kaiki/KaikiArgumentsTypes";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

type sides = "tails" | "heads";

export default class BetflipCommands extends KaikiCommand {
    private readonly coinArgs: { [index: string]: sides };

    constructor() {
        super("betflip", {
            aliases: ["betflip", "bf"],
            description: "Bet on tails or heads. Guessing correct awards you 1.95x the currency you've bet.",
            usage: ["5 heads", "10 t"],
            args: [{
                id: "number",
                type: KaikiArgumentsTypes.KaikiMoneyArgument,
                otherwise: (m) => ({
                    embeds: [new MessageEmbed()
                        .setDescription("Please provide an amount to bet!")
                        .withErrorColor(m)],
                }),
            },
            {
                id: "coin",
                type: (_m, p) => this.coinArgs[p.toLowerCase()],
                otherwise: (m) => ({
                    embeds: [new MessageEmbed()
                        .setDescription("Please select heads or tails!")
                        .withErrorColor(m)],
                }),
            }],
        });
        this.coinArgs = {
            "heads": "heads",
            "head": "heads",
            "h": "heads",
            "tails": "tails",
            "tail": "tails",
            "t": "tails",
        };
    }

    public async exec(message: Message, { number, coin }: { number: number, coin: sides }): Promise<Message> {
        const success = await this.client.money.TryTake(message.author.id, number, "Betflip gamble");

        if (!success) {
            return await message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`You don't have enough ${this.client.money.currencySymbol}`)
                    .withErrorColor(message)],
            });
        }

        const coinFlipped = Math.random() < 0.5
            ? "tails"
            : "heads";

        const emb = new MessageEmbed({
            image: { url: images.gambling.coin[coinFlipped] },
        })
            .setTitle(`Flipped ${coinFlipped}!`);

        if (coin === coinFlipped) {
            const amountWon = Math.round(number * 1.95);
            await this.client.money.Add(message.author.id, amountWon, "Betflip won x1.95");

            return message.channel.send({
                embeds: [emb
                    .setDescription(`You won **${amountWon}** ${this.client.money.currencySymbol}!!`)
                    .withOkColor(message),
                ],
            });
        }

        else {
            return message.channel.send({
                embeds: [emb
                    .setDescription("You lost, better luck next time")
                    .withOkColor(message),
                ],
            });
        }
    }
}
