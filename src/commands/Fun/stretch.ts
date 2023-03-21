import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { AttachmentBuilder, EmbedBuilder, Message } from "discord.js";
import fetch from "node-fetch";
import sharp from "sharp";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "stretch",
    description: "Stretches given member's avatar",
    usage: ["@dreb"],
})
export default class SquishCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {

        const user = await args.rest("user");

        const avatar = await (await fetch(user
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
