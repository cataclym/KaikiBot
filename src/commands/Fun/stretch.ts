import { AttachmentBuilder, EmbedBuilder, GuildMember, Message } from "discord.js";
import fetch from "node-fetch";
import sharp from "sharp";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand.js";


export default class SquishCommand extends KaikiCommand {
    constructor() {
        super("stretch", {
            aliases: ["stretch"],
            description: "Stretches given member's avatar",
            usage: "@dreb",
            args: [
                {
                    id: "member",
                    type: "member",
                    default: (message: Message) => message.member,
                },
            ],
        });
    }

    public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {

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
            color: member.displayColor,
        });

        return message.channel.send({ files: [attachment], embeds: [embed] });
    }
}
