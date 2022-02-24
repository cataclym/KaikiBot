import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class ClaimDailyCommand extends KaikiCommand {
    constructor() {
        super("daily", {
            aliases: ["daily"],
            description: "Claim your daily currency allowance",
            usage: "",
        });
    }

    public async exec(message: Message): Promise<Message> {

        const data = await this.client.orm.botSettings.findFirst({
            select: {
                DailyAmount: true,
                DailyEnabled: true,
            },
        });

        const isEnabled = data!.DailyEnabled;

        if (!isEnabled) return message.channel.send({ embeds: [await KaikiEmbeds.errorMessage(message, "A daily amount has not been set by the bot owner!")] });

        const amount = data!.DailyAmount;

        if (!this.client.cache.dailyProvider.get(message.author.id, false)) {

            this.client.cache.dailyProvider.set(message.author.id, true);
            await this.client.money.Add(message.author.id, Number(amount), "Claimed daily");

            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`**${message.author.tag}**, You've just claimed your daily allowance! ${amount} ${this.client.money.currencyName} ${this.client.money.currencySymbol}`)
                    .withOkColor(message),
                ],
            });
        }

        else {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`**${message.author.tag}**, You've already claimed your daily allowance!!`)
                    .withErrorColor(message),
                ],
            });
        }
    }
}
