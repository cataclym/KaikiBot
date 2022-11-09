import { EmbedBuilder, Message, User } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class cash extends KaikiCommand {
    constructor() {
        super("cash", {
            aliases: ["cash", "currency", "cur", "$", "¥", "£", "€"],
            description: "Shows specified user's current balance. If no user is specified, shows your balance",
            usage: "",
            args: [
                {
                    id: "user",
                    type: "user",
                    default: (m: Message) => m.author,
                },
            ],
        });
    }

    public async exec(msg: Message, { user }: { user: User }): Promise<void> {
        const moneh = await this.client.money.Get(user.id);
        await msg.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${user.username} has **${moneh}** ${this.client.money.currencyName} ${this.client.money.currencySymbol}`)
                    .withOkColor(msg),
            ],
        });
    }
}
