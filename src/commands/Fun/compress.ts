import { AttachmentBuilder, EmbedBuilder, Message, User } from "discord.js";
import fetch from "node-fetch";
import sharp from "sharp";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class SquishCommand extends KaikiCommand {
    constructor() {
        super("compress", {
            aliases: ["compress"],
            description: "Compresses given member's avatar...",
            usage: "@dreb",
            args: [
                {
                    id: "member",
                    type: "user",
                    default: (message: Message) => message.author,
                },
            ],
        });
    }

    public async exec(message: Message, { member }: { member: User }) {
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
