import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { AttachmentBuilder, EmbedBuilder, Message } from "discord.js";
import fetch from "node-fetch";
import sharp from "sharp";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "compress",
    description: "Compresses given member's avatar...",
    usage: ["@dreb"],
})
export default class CompressCommand extends KaikiCommand {

    public async messageRun(message: Message, args: Args) {

        const user = await args.pick("user");

        const avatar = await (await fetch(user.displayAvatarURL({
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
