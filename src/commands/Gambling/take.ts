import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "take",
    description: "Takes money from the specified user",
    usage: ["50 @Cata"],
    preconditions: ["OwnerOnly"],
})
export default class Take extends KaikiCommand {
    public async messageRun(msg: Message, args: Args): Promise<void> {
        const amount = await args.pick("kaikiMoney");
        const user = await args.rest("user");

        const success = await this.client.money.tryTake(user.id, amount, "-");
        if (!success) {
            await msg.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `${user.username} has less than **${amount}** ${this.client.money.currencySymbol}`
                        )
                        .withErrorColor(msg),
                ],
            });
            return;
        }

        await msg.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `Successfully took **${amount}** ${this.client.money.currencySymbol} from ${user.username}`
                    )
                    .withOkColor(msg),
            ],
        });
    }
}
