import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

@ApplyOptions<KaikiCommandOptions>({
    name: "random",
    aliases: ["rng"],
    description: "Sends a random number between your two inputs.",
    usage: ["1 10", "25"],
})
export default class RandomNumberCommand extends KaikiCommand {
    public async exec(message: Message, args: Args): Promise<Message> {


        const numberOne = await args.pick("number").catch(() => 1),
            numberTwo = await args.pick("number").catch(() => 100),
            embed = new EmbedBuilder()
                .setTitle("Result:")
                .setFooter({
                    text: `Random number between ${numberOne} and ${numberTwo}`,
                })
                .withOkColor(message);

        if (numberOne > numberTwo) {
            embed.setDescription(String(getRndInteger(numberTwo, numberOne)));
        }

        else {
            embed.setDescription(String(getRndInteger(numberOne, numberTwo)));
        }

        return message.channel.send({ embeds: [embed] });

    }
}
