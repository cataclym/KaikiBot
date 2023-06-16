import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "award",
    description: "For bot owner to award currency",
    usage: ["50 @Cata"],
    preconditions: ["OwnerOnly"],
})
export default class Award extends KaikiCommand {
    public async messageRun(msg: Message, args: Args): Promise<void> {

        const amount = BigInt(await args.pick("number"));
        const user = await args.rest("user")
            .catch(async () => (await args.rest("member")).user);

        const newAmount = await this.client.money.Add(user.id, amount, "Awarded by bot owner");
        await msg.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`You've awarded **${amount}** ${this.client.money.currencyName} ${this.client.money.currencySymbol} to ${user.username}.
They now have **${newAmount}** ${this.client.money.currencyName} ${this.client.money.currencySymbol}`)
                    .withOkColor(msg),
            ],
        });
    }
}
