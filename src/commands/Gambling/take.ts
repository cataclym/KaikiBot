import { Message, EmbedBuilder, User } from "discord.js";
import KaikiArgumentsTypes from "../../lib/Kaiki/KaikiArgumentsTypes";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class take extends KaikiCommand {
    constructor() {
        super("take", {
            ownerOnly: true,
            aliases: ["take"],
            description: "Takes money from the specified user",
            usage: "50 @Cata",
            args: [
                {
                    id: "amount",
                    type: KaikiArgumentsTypes.KaikiMoneyArgument,
                    otherwise: (m: Message) => ({
                        embeds: [
                            new EmbedBuilder({
                                title: "Invalid amount. It must be a number",
                            })
                                .withOkColor(m),
                        ],
                    }),
                },
                {
                    id: "user",
                    type: "user",
                    otherwise: (m: Message) => ({
                        embeds: [
                            new EmbedBuilder({
                                title: "Can't find this user. Try again.",
                            })
                                .withOkColor(m),
                        ],
                    }),
                },
            ],
        });
    }

    public async exec(msg: Message, { amount, user }: { amount: bigint; user: User; }): Promise<void> {
        const success = await this.client.money.TryTake(user.id, amount, "-");
        if (!success) {
            await msg.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`${user.username} has less than **${amount}** ${this.client.money.currencySymbol}`)
                        .withErrorColor(msg),
                ],
            });
            return;
        }

        await msg.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Successfully took **${amount}** ${this.client.money.currencySymbol} from ${user.username}`)
                    .withOkColor(msg),
            ],
        });
    }
}

