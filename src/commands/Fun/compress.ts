import { GuildMember, Message, MessageAttachment, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import sharp from "sharp";


export default class SquishCommand extends KaikiCommand {
    constructor() {
        super("compress", {
            aliases: ["compress"],
            description: "Compresses given member's avatar...",
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

    public async exec(message: Message, { member }: { member: GuildMember }) {
        const avatar = await (await fetch(member.user.displayAvatarURL({
            dynamic: true,
            size: 32,
            format: "jpg",
        }))).buffer();
        const picture = await sharp(avatar)
            .resize(256, 256, { kernel: "cubic" })
            .webp({ quality: 25 });
        const attachment: MessageAttachment = new MessageAttachment(picture, "compressed.jpg");
        const embed = new MessageEmbed({
            title: "High quality avatar",
            image: { url: "attachment://compressed.jpg" },
            color: member.displayColor,
        });

        return message.channel.send({ files: [attachment], embeds: [embed] });
    }
}
