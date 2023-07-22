import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "cash",
    aliases: ["currency", "cur", "$", "£", "¥", "€"],
    description: "Shows specified user's current balance. If no user is specified, shows your balance",
})
export default class Cash extends KaikiCommand {
    public async messageRun(msg: Message, args: Args): Promise<void> {

        const user = await args.rest("user")
            .catch(async () => (await args.rest("member")).user)
            .catch(() => msg.author);

        const moneh = await this.client.money.get(user.id);
        await msg.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${user.username} has **${moneh}** ${this.client.money.currencyName} ${this.client.money.currencySymbol}`)
                    .withOkColor(msg),
            ],
        });
    }
}
