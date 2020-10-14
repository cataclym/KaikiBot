import { Command } from "discord-akairo";
import { GuildMember, Message, MessageEmbed, MessageAttachment } from "discord.js";
import canvas from "canvas";

export default class SquishCommand extends Command {
	constructor() {
		super("compress", {
			aliases: ["compress"],
			description: { description: "Compresses given member's avatar...", usage: "@dreb" },
			args: [
				{
					"id": "member",
					"type": "member",
					"default": (message: Message) => message.member,
				},
			],
		});
	}
	public async exec(message: Message, { member }: { member: GuildMember}): Promise<Message> {
		const picture = canvas.createCanvas(256, 256);
		const squishImage = picture.getContext("2d");
		const avatar = await canvas.loadImage(member.user.displayAvatarURL({ dynamic: true, size: 64, format: "png" }));
		squishImage.drawImage(avatar, -10, -10, 266, 266);
		const attachment: MessageAttachment = new MessageAttachment(picture.toBuffer("image/jpeg", { quality: 0.04 }), "edit.jpg");
		const embed = new MessageEmbed({
			title: "High quality avatar",
			image: { url: "attachment://edit.jpg" },
			color: member.displayColor,
		});


		return message.channel.send({ files: [attachment], embed: embed });
	}
}