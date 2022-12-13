import { time } from "@discordjs/builders";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message, User } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Constants from "../../struct/Constants";

export default class CurrencyTransactionsCommand extends KaikiCommand {
    constructor() {
        super("currencytransactions", {
            aliases: ["currencytransactions", "curtrs"],
            description: "Shows your currency transactions. Bot owner can see other people's transactions.",
            usage: ["", "7", "10 @drev"],
            args: [
                {
                    id: "optionalPage",
                    type: "number",
                    default: 1,
                    unordered: true,
                },
                {
                    id: "optionalUser",
                    type: "user",
                    default: (m: Message) => m.author,
                    unordered: true,
                },
            ],
        });
    }

    public async exec(message: Message, {
        optionalPage,
        optionalUser,
    }: { optionalUser: User, optionalPage: number }) {

        if (optionalPage <= 0 || !Number.isSafeInteger(optionalPage)) {
            optionalPage = 1;
        }

        const db = (await this.client.orm.currencyTransactions.findMany({
            where: {
                UserId: (optionalUser.id !== message.author.id && message.author.id === message.client.owner.id)
                    ? BigInt(optionalUser.id)
                    : BigInt(message.author.id),
            },
        })).sort((a, b) => b.DateAdded.getTime() - a.DateAdded.getTime());

        if (!db || !db.length) {
            return message.channel.send({
                embeds: [await KaikiEmbeds.embedFail(message, "No currency transactions were found. Try getting some cash!")],
            });
        }

        const pages = [];

        for (let i = Constants.MAGIC_NUMBERS.CMDS.GAMBLING.CUR_TRS.TRANS_PR_PAGE, p = 0;
            p < db.length;
            i += Constants.MAGIC_NUMBERS.CMDS.GAMBLING.CUR_TRS.TRANS_PR_PAGE, p += Constants.MAGIC_NUMBERS.CMDS.GAMBLING.CUR_TRS.TRANS_PR_PAGE) {
            pages.push(CurrencyTransactionsCommand.baseEmbed(message)
                .setDescription(
                    db.slice(p, i)
                        .map(row =>
                            `${row.Amount > Constants.MAGIC_NUMBERS.CMDS.GAMBLING.CUR_TRS.BIGINT_ZERO
                                ? "🟩"
                                : "🟥"} ${time(row.DateAdded)} ${this.client.money.currencySymbol} ${row.Amount}\nNote: \`${row.Reason}\``,
                        )
                        .join("\n"),
                ),
            );
        }
        return sendPaginatedMessage(message, pages, {}, optionalPage - 1);

    }

    private static baseEmbed(message: Message) {
        return new EmbedBuilder()
            .withOkColor(message);
    }
}
