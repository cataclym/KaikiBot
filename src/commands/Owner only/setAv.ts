import Canvas from "canvas";
import { Message, MessageAttachment } from "discord.js";
import logger from "loglevel";
import KaikiCommand from "Kaiki/KaikiCommand";
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
    public async exec(message: Message, { url }: { url: URL}): Promise<Message> {

        const img = await Canvas.loadImage(url.href);
        const canv = Canvas.createCanvas(img.width, img.height);
        const ctx = canv.getContext("2d");

        const { width, height } = Utility.calculateAspectRatioFit(img.width, img.height, img.width, img.height);

        ctx.drawImage(img,
            canv.width / 2 - width / 2,
            canv.height / 2 - height / 2,
            width, height);

        const buffer = canv.toBuffer();

        try {
            await this.client.user?.setAvatar(buffer);
        }
        catch (error) {
            logger.error(error);
            return message.channel.send("Unsupported image type. Please provide a PNG, JPEG or GIF link.");
        }

        return message.channel.send({ content: "Avatar set.", attachments: [new MessageAttachment(buffer)] });
    }
}
