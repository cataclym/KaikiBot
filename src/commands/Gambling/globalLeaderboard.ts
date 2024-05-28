import { ApplyOptions } from "@sapphire/decorators";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "globalleaderboard",
    aliases: ["glb"],
    usage: "",
    description: "Shows global currency leaderboard for the current server."
})
export default class GlobalLeaderboard extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message> {
        const { currencySymbol } = this.client.money;

        const allEntries = (await this.client.orm.discordUsers.findMany({}))
            .sort((e, o) => Number(o.Amount) - Number(e.Amount))
            .map((e, i) => ({
                user: String(e.UserId),
                str: `${e.Amount} ${currencySymbol}`,
                index: i,
            }))
            .slice(0, 20);

        const embed = new EmbedBuilder()
            .setTitle("Global currency leaderboard")
            .withOkColor(message);

        const embeds: EmbedBuilder[] = [];

        if (allEntries.length) {
            for (let i = 9, p = 0; p < allEntries.length; i += 9, p += 9) {
                const emb = EmbedBuilder.from(embed);

                allEntries.slice(p, i).forEach((e) => {
                    emb.addFields({
                        name: `#${e.index + 1} ${this.client.users.cache.get(e.user)?.username ?? e.user}`,
                        value: e.str,
                        inline: true,
                    });
                });

                embeds.push(emb);
            }
        } else {
            embeds.push(embed.setDescription("There's nothing here, yet."));
        }

        return sendPaginatedMessage(message, embeds);
    }
}
