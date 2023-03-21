import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "economy",
    aliases: ["eco"],
    description: "Displays overall currency statistics.",
    preconditions: ["GuildOnly"],
})
export default class EconomyCommand extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message> {
        const { currencySymbol } = this.client.money,
            usersDb = await this.client.orm.discordUsers.findMany({
                select: {
                    Amount: true,
                },
            });
        let totalUsersSum = BigInt(0);

        for await (const { Amount } of usersDb) {
            totalUsersSum += Amount;
        }

        const embeds = [
            new EmbedBuilder()
                .setTitle("Economy stats")
                .addFields([
                    {
                        name: "Total currency owned by users",
                        value: `${totalUsersSum} ${currencySymbol}`,
                    },
                ])
                .withOkColor(message),
        ];

        return message.channel.send({ embeds });
    }
}
