import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class LeaderboardCommand extends KaikiCommand {
    constructor() {
        super("leaderboard", {
            aliases: ["leaderboard", "lb"],
            description: "",
            usage: "",
            channel: "guild",
        });
    }

    public async exec(message: Message): Promise<Message> {
        const { currencySymbol } = this.client.money,
            guildOnlyEntries = (await this.client.orm.discordUsers.findMany({}))
                .filter(e => message.guild?.members.cache.get(String(e.UserId)))
                .sort((e, o) => Number(o.Amount) - Number(e.Amount))
                .map(e => ({
                    user: String(e.UserId),
                    str: `${e.Amount} ${currencySymbol}`,
                })),
            embed = new MessageEmbed()
                .setTitle("Server currency leaderboard")
                .withOkColor(message),
            embeds: MessageEmbed[] = [];

        for (let i = 9, p = 0; p < guildOnlyEntries.length; i += 9, p += 9) {

            const emb = new MessageEmbed(embed);

            guildOnlyEntries.slice(p, i).forEach((e) => {
                emb.addField(message.guild?.members.cache.get(e.user)?.user.tag ?? e.user, e.str, true);
            });

            embeds.push(emb);
        }

        return sendPaginatedMessage(message, embeds, {});
    }
}
