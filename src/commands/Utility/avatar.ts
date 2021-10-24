import { Message, MessageEmbed, User } from "discord.js";
import { KaikiCommand } from "kaiki";


export default class AvatarCommand extends KaikiCommand {
	constructor() {
		super("avatar", {
			aliases: ["avatar", "av"],
			description: "Shows a mentioned person's avatar.",
			usage: "@dreb",
			args: [
				{
					id: "user",
					type: "user",
					default: (message: Message) => message.author,
				},
			],
		});
	}
	public async exec(message: Message, { user }: { user: User }): Promise<Message> {

		const av = user.displayAvatarURL({ size: 4096, dynamic: true }),
			jpeg = user.displayAvatarURL({ size: 4096, dynamic: false, format: "jpg" }),
			png = user.displayAvatarURL({ size: 4096, dynamic: false, format: "png" }),
			webp = user.displayAvatarURL({ size: 4096, dynamic: false, format: "webp" });

		const embeds = [new MessageEmbed({
			title: user.tag,
			fields: [{ name: "Links", value: `${av !== webp ? `[gif](${av}) ` : ""}[jpg](${jpeg}) [png](${png}) [webp](${webp})`, inline: false }],
			image: { url: av },
			footer: { text: "ID: " + user.id },
		})
			.withOkColor(message)];

		if (message.guild) {
			const member = message.guild.members.cache.get(user.id);
			if (member && member.avatar) {
				const memberAvatar = member.displayAvatarURL({ size: 4096, dynamic: true }),
					memberJpeg = member.displayAvatarURL({ size: 4096, dynamic: false, format: "jpg" }),
					memberPng = member.displayAvatarURL({ size: 4096, dynamic: false, format: "png" }),
					memberWebp = member.displayAvatarURL({ size: 4096, dynamic: false, format: "webp" });

				embeds.push(new MessageEmbed({
					title: "Server avatar",
					fields: [{ name: "Links", value: `${memberAvatar !== memberWebp ? `[gif](${memberAvatar}) ` : ""}[jpg](${memberJpeg}) [png](${memberPng}) [webp](${memberWebp})`, inline: false }],
					image: { url: memberAvatar },
				})
					.withOkColor(message));
			}
		}

		return message.channel.send({ embeds });
	}
}
