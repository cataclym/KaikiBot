import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { AttachmentBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";
import * as buffer from "buffer";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "setavatar",
    aliases: ["setav"],
    description: "Assigns the bot a new avatar.",
    usage: [
        "https://discord.com/media/1231231231231312321/1231231312323132.png",
    ],
    preconditions: ["OwnerOnly"],
})
export default class SetAvatarCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {
        const url = await args.rest("url");

        if (!url.href.match(Constants.imgExtensionsRegex)?.length)
            throw new Error(
                "Unsupported image type. Please provide a PNG, JPEG or GIF link."
            );

        const img = await KaikiUtil.loadImage(url.href);

        await this.client.user?.setAvatar(buffer.Buffer.from(img));

        return message.channel.send({
            content: "Avatar set.",
            files: [new AttachmentBuilder(buffer.Buffer.from(img))],
        });
    }
}
