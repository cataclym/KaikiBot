import { Command } from "@cataclym/discord-akairo";
import Canvas from "canvas";
import { Message, MessageAttachment } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { calculateAspectRatioFit } from "../../lib/Util";

export default class SetAvatarCommand extends Command {
	constructor() {
		super("setavatar", {
			aliases: ["setavatar", "setav"],
			description: { description: "Assigns the bot a new avatar.", usage: "http://discord.com/media/1231231231231312321/1231231312323132.png" },
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

		const canv = Canvas.createCanvas(128, 128);
		const img = Canvas.loadImage(url.href);
		const ctx = canv.getContext("2d");

		const { width, height } = calculateAspectRatioFit((await img).width, (await img).height, (await img).width, 128);

		ctx.drawImage(await img,
			canv.width / 2 - width / 2,
			canv.height / 2 - height / 2,
			width, height);
		const buffer = canv.toBuffer();
		try {
			this.client.user?.setAvatar(buffer);
		}
		catch (error) {
			console.error(error);
			return message.channel.send("Unsupported image type. Please use PNG, JPEG or GIF.");
		}

		return message.channel.send("Avatar set.", new MessageAttachment(buffer));
	}
}