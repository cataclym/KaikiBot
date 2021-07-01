import { Command } from "discord-akairo";
import { User, Message, MessageEmbed } from "discord.js";

export default class AvatarCommand extends Command {
	constructor() {
		super("avatar", {
			aliases: ["avatar", "av"],
			description: { description: "Shows a mentioned person's avatar.", usage: "@dreb" },
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
