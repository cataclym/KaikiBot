import { User, Message, MessageEmbed } from "discord.js";
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

		return message.channel.send({ embeds: [new MessageEmbed({
			title: user.tag,
			fields: [{ name: "Links", value: `[gif](${av}) [jpg](${jpeg}) [png](${png}) [webp](${webp})`, inline: false }],
			image: { url: av },
			footer: { text: "ID: " + user.id },
		})
			.withOkColor(message)] });
	}
}
