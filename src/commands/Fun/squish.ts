import { ApplyOptions } from "@sapphire/decorators";
import { Args, UserError } from "@sapphire/framework";
import {
    AttachmentBuilder,
    EmbedBuilder,
    GuildMember,
    Message,
} from "discord.js";

import sharp from "sharp";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "squish",
    description: "Squishes given member's avatar",
    usage: ["@dreb"],
    preconditions: ["GuildOnly"],
})
export default class SquishCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        const member = <GuildMember>await args.pick("member").catch(() => {
            if (args.finished) {
                return message.member;
            }
            throw new UserError({
                identifier: "NoMemberProvided",
                message: "Couldn't find a server member with that name.",
            });
        });
        const avatar = await (
            await fetch(
                member.displayAvatarURL({
                    size: 256,
                    extension: "jpg",
                })
            )
        ).arrayBuffer();

        const picture = sharp(avatar).resize(64, 256, { fit: "fill" }).webp();

        const attachment: AttachmentBuilder = new AttachmentBuilder(
            await picture.toBuffer(),
            { name: "Squished.jpg" }
        );
        const embed = new EmbedBuilder({
            title: "Squished avatar...",
            image: { url: "attachment://Squished.jpg" },
        }).withOkColor(message);

        return message.reply({ files: [attachment], embeds: [embed] });
    }
}
