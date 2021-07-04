import Canvas from "canvas";
import { Message, MessageAttachment } from "discord.js";
import logger from "loglevel";
import { noArgGeneric } from "../../lib/Embeds";
import { calculateAspectRatioFit } from "../../lib/Util";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class SetAvatarCommand extends KaikiCommand {
	constructor() {
		super("setavatar", {
			aliases: ["setavatar", "setav"],
			description: "Assigns the bot a new avatar.",
			usage: "http://discord.com/media/1231231231231312321/1231231312323132.png",
			ownerOnly: true,
			args: [
				{
					id: "url",
					type: "url",
					otherwise: (msg: Message) => noArgGeneric(msg),
				},
			],
		});
	}
	public async exec(message: Message, { url }: { url: URL}): Promise<Message> {

		const img = await Canvas.loadImage(url.href);
		const canv = Canvas.createCanvas(img.width, img.height);
		const ctx = canv.getContext("2d");

		const { width, height } = calculateAspectRatioFit(img.width, img.height, img.width, img.height);

		ctx.drawImage(img,
			canv.width / 2 - width / 2,
			canv.height / 2 - height / 2,
			width, height);

		const buffer = canv.toBuffer();

		try {
			this.client.user?.setAvatar(buffer);
		}
		catch (error) {
			logger.error(error);
			return message.channel.send("Unsupported image type. Please use PNG, JPEG or GIF.");
		}

		return message.channel.send({ content: "Avatar set.", embeds: [new MessageAttachment(buffer)] });
	}
}
