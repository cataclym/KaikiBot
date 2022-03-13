import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";
import { getBotDocument } from "../../struct/documentMethods";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class SetDailyCommand extends KaikiCommand {
    constructor() {
        super("setdaily", {
            aliases: ["setdaily", "dailyset"],
            description: "Sets the daily currency allowance amount. Set to 0 to disable.",
            usage: "",
            ownerOnly: true,
            args: [{
                id: "arg",
                type: "integer",
                default: 0,
            }],
        });
    }

    public async exec(message: Message<true>, { arg }: { arg: number }): Promise<Message> {

        const isEnabled = this.client.botSettingsProvider.get("1", "DailyEnabled", false);

        if (arg > 0) {
            await this.client.botSettingsProvider.set("1", "DailyEnabled", true);
            await this.client.botSettingsProvider.set("1", "DailyAmount", arg);
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Users will be able to claim ${arg} ${this.client.money.currencyName} ${this.client.money.currencySymbol} every day`)
                    .withOkColor(message),
                ],
            });
        }

        else if (!isEnabled) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription("Daily currency allowance is already disabled!")
                    .withErrorColor(message),
                ],
            });
        }

        else {
            await this.client.botSettingsProvider.set("1", "DailyEnabled", false);
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription("Disabled daily currency allowance.")
                    .withOkColor(message),
                ],
            });
        }
    }
}
