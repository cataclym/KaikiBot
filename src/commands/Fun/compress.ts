import { ApplyOptions } from "@sapphire/decorators";
import { Args, UserError } from "@sapphire/framework";
import { AttachmentBuilder, EmbedBuilder, GuildMember, Message } from "discord.js";
import fetch from "node-fetch";
import sharp from "sharp";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "compress",
    description: "Compresses given member's avatar...",
    usage: ["@dreb"],
    preconditions: ["GuildOnly"],
})
export default class CompressCommand extends KaikiCommand {

    public async messageRun(message: Message, args: Args) {

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

        const avatar = await (await fetch(member.displayAvatarURL({
            size: 32,
            extension: "jpg",
        }))).buffer();

        const picture = sharp(avatar)
            .resize(256, 256, { kernel: "nearest" })
            .webp({ quality: 50 });

        const attachment = new AttachmentBuilder(picture, { name: "compressed.jpg" });

        const embed = new EmbedBuilder({
            title: "High quality avatar",
            image: { url: "attachment://compressed.jpg" },
        })
            .withOkColor(message);

        return message.channel.send({ files: [attachment], embeds: [embed] });
    }
}
