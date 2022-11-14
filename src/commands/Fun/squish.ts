import { AttachmentBuilder, EmbedBuilder, GuildMember, Message } from "discord.js";
import fetch from "node-fetch";
import sharp from "sharp";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand.js";


export default class SquishCommand extends KaikiCommand {
    constructor() {
        super("squish", {
            aliases: ["squish"],
            description: "Squishes given member's avatar",
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
            color: member.displayColor,
        });

        return message.channel.send({ files: [attachment], embeds: [embed] });
    }
}
