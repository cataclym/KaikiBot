import { User, Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "../../lib/KaikiClass";

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
		const av = user.displayAvatarURL({ size: 2048, dynamic: true });
		return message.channel.send({ embeds: [new MessageEmbed({
			title: user.tag,
			description: `[Link](${av})`,
			image: { url: av },
			footer: { text: "ID: " + user.id },
		})
			.withOkColor(message)] });
	}
}
