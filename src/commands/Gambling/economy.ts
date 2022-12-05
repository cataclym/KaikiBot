import { EmbedBuilder, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class EconomyCommand extends KaikiCommand {
    constructor() {
        super("economy", {
            aliases: ["economy", "eco"],
            description: "Displays overall currency statistics.",
            usage: "",
            channel: "guild",
        });
    }

    public async exec(message: Message): Promise<Message> {
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
