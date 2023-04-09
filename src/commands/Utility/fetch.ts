import { time } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "fetch",
    aliases: ["fu"],
    description: "Fetches a discord user, shows relevant information. 30sec cooldown.",
    usage: ["<id>"],
    cooldownDelay: 30000,
})
export default class FetchUserCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message | void> {

        const userObject = await args.rest("user");

        // TODO: Add uinfo somehow. And check argument parsing uncached users.

        const userFlags = userObject.flags ? userObject.flags.toArray() : [],
            embed = new EmbedBuilder()
                .setDescription(userObject.username)
                .setThumbnail(userObject.displayAvatarURL({ size: 4096 }))
                .setTitle(userObject.tag)
                .addFields([
                    { name: "ID", value: userObject.id, inline: true },
                    { name: "Account date", value: time(userObject.createdAt), inline: true },
                ])
                .withOkColor(message);

        if (userFlags.length) {
            embed.addFields([
                {
                    name: "Flags",
                    value: userFlags.map((flag) => Constants.flags[flag]).join("\n"),
                    inline: true,
                },
            ]);
        }
        if (userObject.bot) {
            embed.addFields([
                {
                    name: "Bot",
                    value: "✅",
                    inline: true,
                },
            ]);
        }

        return message.channel.send({ embeds: [embed] });
    }
}
