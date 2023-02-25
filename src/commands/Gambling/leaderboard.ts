import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class LeaderboardCommand extends KaikiCommand {
    constructor() {
        super("leaderboard", {
            aliases: ["leaderboard", "lb"],
            description: "Shows currency leaderboard for the current server.",
            usage: "",
            channel: "guild",
        });
    }

    public async exec(message: Message): Promise<Message> {
        const { currencySymbol } = this.client.money,
            guildOnlyEntries = (await this.client.orm.discordUsers.findMany({}))
                .filter(e => message.guild?.members.cache.get(String(e.UserId)))
                .sort((e, o) => Number(o.Amount) - Number(e.Amount))
                .map((e, i) => ({
                    user: String(e.UserId),
                    str: `${e.Amount} ${currencySymbol}`,
                    index: i,
                })),
            embed = new EmbedBuilder()
                .setTitle("Server currency leaderboard")
                .withOkColor(message),
            embeds: EmbedBuilder[] = [];

        if (guildOnlyEntries.length) {
            for (let i = 9, p = 0; p < guildOnlyEntries.length; i += 9, p += 9) {

                const emb = EmbedBuilder.from(embed);

                guildOnlyEntries.slice(p, i).forEach((e) => {
                    emb.addFields({
                        name: `#${e.index + 1} ${message.guild?.members.cache.get(e.user)?.user.tag ?? e.user}`,
                        value: e.str,
                        inline: true,
                    });
                });

                embeds.push(emb);
            }
        }
        else {
            embeds.push(embed.setDescription("There's nothing here, yet."));
        }

        return sendPaginatedMessage(message, embeds, {});
    }
}
