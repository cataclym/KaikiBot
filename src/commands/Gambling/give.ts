import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "give",
    description: "Gives money to another user",
    usage: ["50 @Cata"],
})
export default class Give extends KaikiCommand {
    public async messageRun(msg: Message, args: Args) {

        const amount = await args.pick("kaikiMoney");
        const user = await args.rest("user");

        if (user.id === msg.author.id) {
            await msg.channel.send(`You can't give yourself ${this.client.money.currencySymbol}`);
            return;
        }

        const success = await this.client.money.TryTake(msg.author.id, amount, `Given money to ${user.username} [${user.id}]`);
        if (!success) {
            await msg.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`You don't have enough ${this.client.money.currencySymbol}`)
                        .withErrorColor(msg),
                ],
            });
            return;
        }

        await this.client.money.Add(user.id, amount, `Gift from ${msg.author.username} [${msg.author.id}]`);
        await msg.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`You've given **${amount}** ${this.client.money.currencySymbol} to ${user.username}`)
                    .withOkColor(msg),
            ],
        });
    }
}
