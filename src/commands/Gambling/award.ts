import { Message, MessageEmbed, User } from "discord.js";
import KaikiArgumentsTypes from "../../lib/Kaiki/KaikiArgumentsTypes";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class award extends KaikiCommand {
    constructor() {
        super("award", {
            ownerOnly: true,
            aliases: ["award"],
            description: "For bot owner to award currency",
            usage: "50 @Cata",
            args: [
                {
                    id: "amount",
                    type: KaikiArgumentsTypes.KaikiMoneyArgument,
                    otherwise: (m: Message) => ({
                        embeds: [new MessageEmbed({
                            title: "Invalid amount. It must be a number",
                        })
                            .withErrorColor(m)],
                    }),
                },
                {
                    id: "user",
                    type: "user",
                    otherwise: (m: Message) => ({
                        embeds: [new MessageEmbed({
                            title: "Can't find this user. Try again.",
                        })
                            .withErrorColor(m)],
                    }),
                },
            ],
        });
    }

    public async exec(msg: Message, { amount, user }: { amount: number; user: User; }): Promise<void> {
        const newAmount = await this.client.money.Add(user.id, amount, "Awarded by bot owner");
        const bInt = BigInt(amount);
        await msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`You've awarded **${bInt}** ${this.client.money.currencyName} ${this.client.money.currencySymbol} to ${user.username}.
They now have **${newAmount}** ${this.client.money.currencyName} ${this.client.money.currencySymbol}`)
                .withOkColor(msg)],
        });
    }
}
