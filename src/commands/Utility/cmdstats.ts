import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "cmdstats",
    aliases: ["commandstats"],
    description: "Displays command statistics. Stats are updated at interval.",
})
export default class Cmdstats extends KaikiCommand {
    async messageRun(message: Message) {
        const db = await this.client.orm.commandStats.findMany();

        const total = db.map((entry) => entry.Count).reduce((a, b) => a + b);

        const sorted = db.sort((a, b) => b.Count - a.Count);

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Command-stats")
                    .setDescription(`Total: **${total}**`)
                    .addFields([
                        {
                            name: "Most used",
                            value: sorted
                                .slice(0, 5)
                                .map(
                                    (entry, i) =>
                                        `#**${i + 1}** ${entry.CommandAlias}: **${entry.Count}**`
                                )
                                .join("\n"),
                        },
                    ])
                    .withOkColor(),
            ],
        });
    }
}
