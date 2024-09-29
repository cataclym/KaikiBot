import { time } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { Args, UserError } from "@sapphire/framework";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/Kaiki/KaikiEmbeds";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "currencytransactions",
    aliases: ["curtrs"],
    description:
		"Shows your currency transactions. Bot owner can see other people's transactions.",
    usage: ["", "7", "10 @drev"],
})
export default class CurrencyTransactionsCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args) {
        const firstArg = await Promise.resolve(
            args
                .pick("number")
                .catch(async () =>
                    args.pick("member").then(async (m) => m.user)
                )
                .catch(async () => {
                    if (args.finished) {
                        return message.author;
                    }
                    throw new UserError({
                        identifier: "IncorrectArgs",
                        message:
							"Your arguments didn't resolve to a number or a member.",
                    });
                })
        );

        const secondArg = await Promise.resolve(
            args.pick("member").then(async (m) => m.user)
        ).catch(async () => {
            if (args.finished) {
                return null;
            }
            throw new UserError({
                identifier: "IncorrectArgs",
                message: "Your arguments didn't resolve to a member.",
            });
        });

        let page = 1;
        let user = message.author;

        if (typeof firstArg === "number") {
            if (Number.isSafeInteger(firstArg)) {
                page = firstArg;
            } else {
                throw new UserError({
                    message: "Provide a valid number.",
                    identifier: "UnsafeInteger",
                });
            }
        } else {
            user = firstArg;
        }

        if (secondArg) {
            user = secondArg;
        }

        const db = (
            await this.client.orm.currencyTransactions.findMany({
                where: {
                    UserId:
						user.id !== message.author.id &&
						message.author.id === message.client.owner.id
						    ? BigInt(user.id)
						    : BigInt(message.author.id),
                },
            })
        ).sort((a, b) => b.DateAdded.getTime() - a.DateAdded.getTime());

        if (!db || !db.length) {
            return message.reply({
                embeds: [
                    await KaikiEmbeds.embedFail(
                        message,
                        "No currency transactions were found. Try getting some cash!"
                    ),
                ],
            });
        }

        const pages = [];

        for (
            let i = Constants.MAGIC_NUMBERS.CMDS.GAMBLING.CUR_TRS.TRANS_PR_PAGE,
                p = 0;
            p < db.length;
            i += Constants.MAGIC_NUMBERS.CMDS.GAMBLING.CUR_TRS.TRANS_PR_PAGE,
            p += Constants.MAGIC_NUMBERS.CMDS.GAMBLING.CUR_TRS.TRANS_PR_PAGE
        ) {
            pages.push(
                CurrencyTransactionsCommand.baseEmbed(message)
                    .setTitle(
                        `Showing ${user.username}'s currency transactions`
                    )
                    .setDescription(
                        db
                            .slice(p, i)
                            .map(
                                (row) =>
                                    `${
                                        row.Amount >
										Constants.MAGIC_NUMBERS.CMDS.GAMBLING
										    .CUR_TRS.BIGINT_ZERO
                                            ? "🟩"
                                            : "🟥"
                                    } ${time(row.DateAdded)} ${this.client.money.currencySymbol} ${row.Amount}\nNote: \`${row.Reason}\``
                            )
                            .join("\n")
                    )
            );
        }
        return sendPaginatedMessage(message, pages, { startPage: page - 1 });
    }

    private static baseEmbed(message: Message) {
        return new EmbedBuilder().withOkColor(message);
    }
}
