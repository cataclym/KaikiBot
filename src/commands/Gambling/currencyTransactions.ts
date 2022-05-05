import { time } from "@discordjs/builders";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { Message, MessageEmbed, User } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class CurrencyTransactionsCommand extends KaikiCommand {
    constructor() {
        super("currencytransactions", {
            aliases: ["currencytransactions", "curtrs"],
            description: "Shows your currency transactions. Bot owner can see other people's transactions.",
            usage: ["", "7", "@drev 10"],
            args: [{
                id: "optionalUser",
                type: "user",
                default: (m: Message) => m.author,
            },
            {
                id: "optionalPage",
                type: "number",
                default: 1,
            }],
        });
    }

    public async exec(message: Message, {
        optionalUser,
        optionalPage,
    }: { optionalUser: User, optionalPage: number }) {

        if (optionalPage < 1 || !Number.isSafeInteger(optionalPage)) {
            optionalPage = 1;
        }

        let db;

        if (optionalUser.id !== message.author.id && message.author.id === message.client.owner.id) {
            db = await this.client.orm.currencyTransactions.findMany({
                where: {
                    UserId: BigInt(optionalUser.id),
                },
            });
        }

        else {
            db = await this.client.orm.currencyTransactions.findMany({
                where: {
                    UserId: BigInt(message.author.id),
                },
            });
        }

        if (!db || !db.length) {
            return message.channel.send({
                embeds: [await KaikiEmbeds.embedFail(message, "No currency transactions were found. Try getting some cash!")],
            });
        }

        const pages = [];

        for (let i = 15, p = 0; p < db.length; i += 15, p += 15) {
            pages.push(CurrencyTransactionsCommand.baseEmbed(message)
                .setDescription(
                    db.slice(p, i)
                        .reverse()
                        .map(row =>
                            `${row.Amount > 0n
                                ? "🟩"
                                : "🟥"} ${time(row.DateAdded)} ${this.client.money.currencySymbol} ${row.Amount}\nNote: \`${row.Reason}\``,
                        )
                        .join("\n"),
                ),
            );
        }
        return sendPaginatedMessage(message, pages, {}, optionalPage);

    }

    private static baseEmbed(message: Message) {
        return new MessageEmbed()
            .withOkColor(message);
    }
}
