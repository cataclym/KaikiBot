import { GuildMember, Message, MessageAttachment, EmbedBuilder } from "discord.js";
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

        const avatar = await (await fetch(member.displayAvatarURL({
            dynamic: true,
            size: 512,
            format: "jpg",
        }))).buffer();

        const picture = sharp(avatar)
            .resize(1024, 256, { fit: "fill" })
            .webp();

        const attachment: MessageAttachment = new MessageAttachment(await picture.toBuffer(), "Stretched.jpg");
        const embed = new EmbedBuilder({
            title: "Stretched avatar...",
            image: { url: "attachment://Stretched.jpg" },
            color: member.displayColor,
        });

        return message.channel.send({ files: [attachment], embeds: [embed] });
    }
}
