import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { AttachmentBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";

@ApplyOptions<KaikiCommandOptions>({
    name: "setavatar",
    aliases: ["setav"],
    description: "Assigns the bot a new avatar.",
    usage: ["https://discord.com/media/1231231231231312321/1231231312323132.png"],
    preconditions: ["OwnerOnly"],
})
export default class SetAvatarCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {

        const url = await args.rest("url");

        const img = await Utility.loadImage(url.href);

        try {
            await this.client.user?.setAvatar(img);
        }
        catch (error) {
            throw new Error("Unsupported image type. Please provide a PNG, JPEG or GIF link.");
        }

        return message.channel.send({ content: "Avatar set.", files: [new AttachmentBuilder(img)] });
    }
}
