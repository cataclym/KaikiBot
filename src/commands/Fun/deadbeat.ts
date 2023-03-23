import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { AttachmentBuilder, Message } from "discord.js";
import sharp from "sharp";
import images from "../../data/images.json";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
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

    private backgroundUrl = images.fun.commands.deadbeat;

    public async exec(message: Message, args: Args) {

        const user = await args.rest("user");

        const buffer = await Utility.loadImage(user.displayAvatarURL({ extension: "jpg", size: 128 }));

        const modified = await sharp(buffer)
            .resize({ height: 189, width: 205 })
            .toBuffer();

        const image = sharp(await this.background())
            .composite([{ input: modified, top: 88, left: 570 }]);

        const attachment = new AttachmentBuilder(image, { name: "deadBeats.jpg" });
        await message.channel.send({ content: `Deadbeat 👉 ${user}!`, files: [attachment] });
    }

    private async background() {
        return Utility.loadImage(this.backgroundUrl);
    }
}
