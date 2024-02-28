import { ApplyOptions } from "@sapphire/decorators";
import { Args, UserError } from "@sapphire/framework";
import { AttachmentBuilder, cleanContent, GuildMember, Message } from "discord.js";
import sharp from "sharp";
import Images from "../../data/images.json";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";

@ApplyOptions<KaikiCommandOptions>({
    name: "deadbeat",
    aliases: ["dead"],
    description: "Just try it",
    usage: ["@dreb"],
    typing: true,
    cooldownDelay: 8000,
    preconditions: ["GuildOnly"],
})
export default class DeadbeatCommand extends KaikiCommand {

    private backgroundUrl = Images.fun.commands.deadbeat;

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

        const buffer = await KaikiUtil.loadImage(member.displayAvatarURL({ extension: "jpg", size: 128 }));

        const modified = await sharp(buffer)
            .resize({ height: 189, width: 205 })
            .toBuffer();

        const image = sharp(await this.background())
            .composite([{ input: modified, top: 88, left: 570 }]);

        const attachment = new AttachmentBuilder(image, { name: "deadBeats.jpg" });
        await message.channel.send({
            content: cleanContent(`Deadbeat 👉 ${member}!`, message.channel),
            files: [attachment],
        });
    }

    private async background() {
        return KaikiUtil.loadImage(this.backgroundUrl);
    }
}
