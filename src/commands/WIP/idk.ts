import { Command } from "discord-akairo";
import { GuildMember, Message, MessageEmbed, MessageAttachment } from "discord.js";
import canvas from "canvas";

export default class what extends Command {
	constructor() {
		super("wtf", {
			aliases: ["wtf"],
			description: { description: "WIP image manipulation command." },
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
		squishImage.setTransform(0, -0.4, 1, 1.5, 0, 0);
		const avatar = await canvas.loadImage(member.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }));
		squishImage.drawImage(avatar, 0, 0, 256, 256);
		const attachment: MessageAttachment = new MessageAttachment(picture.toBuffer("image/jpeg", { quality: 0.5 }), "edit.jpg");
		const embed = new MessageEmbed({
			title: "wtf?",
			image: { url: "attachment://edit.jpg" },
			color: member.displayColor,
		});


		return message.channel.send({ files: [attachment], embed: embed });
	}
}