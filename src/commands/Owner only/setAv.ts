import { Message, MessageAttachment } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";

export default class SetAvatarCommand extends KaikiCommand {
    constructor() {
        super("setavatar", {
            aliases: ["setavatar", "setav"],
            description: "Assigns the bot a new avatar.",
            usage: "https://discord.com/media/1231231231231312321/1231231312323132.png",
            ownerOnly: true,
            args: [
                {
                    id: "url",
                    type: "url",
                    otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
                },
            ],
        });
    }

    public async exec(message: Message, { url }: { url: URL }): Promise<Message> {

        const img = await Utility.loadImage(url.href);

        try {
            await this.client.user?.setAvatar(img);
        }
        catch (error) {
            throw new Error("Unsupported image type. Please provide a PNG, JPEG or GIF link.");
        }

        return message.channel.send({ content: "Avatar set.", files: [new MessageAttachment(img)] });
    }
}
