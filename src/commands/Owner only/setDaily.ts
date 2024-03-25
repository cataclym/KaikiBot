import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "setdaily",
    aliases: ["dailyset"],
    description:
        "Sets the daily currency allowance amount. Set to 0 to disable.",
    preconditions: ["OwnerOnly"],
})
export default class SetDailyCommand extends KaikiCommand {
    public async messageRun(
        message: Message<true>,
        args: Args
    ): Promise<Message> {
        const arg = await args.rest("integer").catch(() => 0);

        const isEnabled = this.client.botSettings.get(
            "1",
            "DailyEnabled",
            false
        );

        if (arg > 0) {
            await this.client.botSettings.set("1", "DailyEnabled", true);
            await this.client.botSettings.set("1", "DailyAmount", arg);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `Users will be able to claim ${arg} ${this.client.money.currencyName} ${this.client.money.currencySymbol} every day`
                        )
                        .withOkColor(message),
                ],
            });
        } else if (!isEnabled) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "Daily currency allowance is already disabled!"
                        )
                        .withErrorColor(message),
                ],
            });
        } else {
            await this.client.botSettings.set("1", "DailyEnabled", false);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Disabled daily currency allowance.")
                        .withOkColor(message),
                ],
            });
        }
    }
}
