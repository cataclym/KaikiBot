import { ApplyOptions } from "@sapphire/decorators";
import { Args, UserError } from "@sapphire/framework";
import { AttachmentBuilder, EmbedBuilder, GuildMember, Message } from "discord.js";
import fetch from "node-fetch";
import sharp from "sharp";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "stretch",
    description: "Stretches given member's avatar",
    usage: ["@dreb"],
    preconditions: ["GuildOnly"],
})
export default class SquishCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {

        const member = <GuildMember> await args.pick("member")
            .catch(() => {
                if (args.finished) {
                    return message.member;
                }
                throw new UserError({
                    identifier: "NoMemberProvided",
                    message: "Couldn't find a server member with that name.",
                });
            });

        const avatar = await (await fetch(member
            .displayAvatarURL({
                size: 512,
                extension: "jpg",
            }),
        )).buffer();

        const picture = sharp(avatar)
            .resize(1024, 256, { fit: "fill" })
            .webp();

        const attachment: AttachmentBuilder = new AttachmentBuilder(await picture.toBuffer(), { name: "Stretched.jpg" });
        const embed = new EmbedBuilder({
            title: "Stretched avatar...",
            image: { url: "attachment://Stretched.jpg" },
        })
            .withOkColor(message);

        return message.channel.send({ files: [attachment], embeds: [embed] });
    }
}
