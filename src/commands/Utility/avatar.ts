import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "avatar",
    aliases: ["av"],
    description: "Shows a mentioned person's avatar.",
    usage: "@dreb",
})
export default class AvatarCommand extends KaikiCommand {

    public async messageRun(message: Message, args: Args): Promise<Message> {

        const user = await args.pick("user").catch(() => message.author);

        const av = user.displayAvatarURL({ size: 4096 }),
            jpeg = user.displayAvatarURL({ size: 4096, extension: "jpg" }),
            png = user.displayAvatarURL({ size: 4096, extension: "png" }),
            webp = user.displayAvatarURL({ size: 4096, extension: "webp" });

        const embeds = [
            new EmbedBuilder({
                title: user.username,
                fields: [
                    {
                        name: "Links",
                        value: `${av !== webp ? `[gif](${av}) ` : ""}[jpg](${jpeg}) [png](${png}) [webp](${webp})`,
                        inline: false,
                    },
                ],
                image: { url: av },
                footer: { text: "ID: " + user.id },
            })
                .withOkColor(message),
        ];

        if (message.guild) {
            const member = message.guild.members.cache.get(user.id);
            if (member && member.avatar) {
                const memberAvatar = member.displayAvatarURL({ size: 4096 }),
                    memberJpeg = member.displayAvatarURL({ size: 4096, extension: "jpg" }),
                    memberPng = member.displayAvatarURL({ size: 4096, extension: "png" }),
                    memberWebp = member.displayAvatarURL({ size: 4096, extension: "webp" });

                embeds.push(new EmbedBuilder({
                    title: "Server avatar",
                    fields: [
                        {
                            name: "Links",
                            value: `${memberAvatar !== memberWebp ? `[gif](${memberAvatar}) ` : ""}[jpg](${memberJpeg}) [png](${memberPng}) [webp](${memberWebp})`,
                            inline: false,
                        },
                    ],
                    image: { url: memberAvatar },
                })
                    .withOkColor(message));
            }
        }

        return message.channel.send({ embeds });
    }
}
