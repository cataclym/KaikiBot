import { ApplyOptions } from "@sapphire/decorators";
import Discord, { Message, User } from "discord.js";
import sharp from "sharp";
import images from "../../data/images.json";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";

@ApplyOptions<KaikiCommandOptions>({
    name: "deadbeat",
    aliases: ["dead"],
    description: "Just try it",
    usage: ["@dreb"],
    typing: true,
    cooldownDelay: 8000,
})
export default class DeadbeatCommand extends KaikiCommand {
    // I should host this on GitLab
    private backgroundUrl = images.fun.commands.deadbeat;

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
