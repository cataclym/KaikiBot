import Discord, { Message, User } from "discord.js";
import sharp from "sharp";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility.js";

export default class DeadbeatCommand extends KaikiCommand {
    // I should host this on GitLab
    private backgroundUrl = "https://cdn.discordapp.com/attachments/717045059215687691/763459004352954368/deadbeats.jpg";

    constructor() {
        super("deadbeat", {
            aliases: ["dead", "deadbeat"],
            description: "Just try it",
            usage: "@dreb",
            cooldown: 8000,
            typing: true,
            args: [
                {
                    id: "member",
                    type: "member",
                    default: (message: Message) => message.author,
                },
            ],
        });
    }

    public async exec(message: Message, { member }: { member: User }) {

        const buffer = await Utility.loadImage(member.displayAvatarURL({ extension: "jpg", size: 128 }));

        const modified = await sharp(buffer)
            .resize({ height: 189, width: 205 })
            .toBuffer();

        const image = sharp(await this.background())
            .composite([{ input: modified, top: 88, left: 570 }]);

        const attachment = new Discord.AttachmentBuilder(image, { name: "deadBeats.jpg" });
        await message.channel.send({ content: `Deadbeat 👉 ${member}!`, files: [attachment] });
    }

    private async background() {
        return Utility.loadImage(this.backgroundUrl);
    }
}
