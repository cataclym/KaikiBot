import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { AttachmentBuilder, EmbedBuilder, Message } from "discord.js";
import fetch from "node-fetch";
import sharp from "sharp";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "squish",
    description: "Squishes given member's avatar",
    usage: ["@dreb"],
})
export default class SquishCommand extends KaikiCommand {

    public async messageRun(message: Message, args: Args): Promise<Message> {

        const user = await args.rest("user");

        const avatar = await (await fetch(user.displayAvatarURL({
            size: 256,
            extension: "jpg",
        }))).buffer();

        const picture = sharp(avatar)
            .resize(64, 256, { fit: "fill" })
            .webp();

        const attachment: AttachmentBuilder = new AttachmentBuilder(await picture.toBuffer(), { name: "Squished.jpg" });
        const embed = new EmbedBuilder({
            title: "Squished avatar...",
            image: { url: "attachment://Squished.jpg" },
        })
            .withOkColor(message);

        return message.channel.send({ files: [attachment], embeds: [embed] });
    }
}
