import { Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "kaiki";


function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class RandomNumberCommand extends KaikiCommand {
    constructor() {
        super("random", {
            usage: ["1 10", "25"],
            description: "Sends a random number between your two inputs.",
            args: [{
                id: "int",
                type: "integer",
                default: 1,
            },
            {
                id: "int2",
                type: "integer",
                default: 100,
            }],
            aliases: ["random", "rng"],
        });
    }

    public async exec(message: Message, args: { int: number, int2: number }): Promise<Message> {

        const number1 = args.int,
            number2 = args.int2,
            embed = new MessageEmbed()
                .setTitle("Result:")
                .setFooter({ text: `Random number between ${number1} and ${number2}`,
                })
                .withOkColor(message);

        if (number1 > number2) {
            embed.setDescription(String(getRndInteger(number2, number1)));
        }

        else {
            embed.setDescription(String(getRndInteger(number1, number2)));
        }

        return message.channel.send({ embeds: [embed] });

    }
}
