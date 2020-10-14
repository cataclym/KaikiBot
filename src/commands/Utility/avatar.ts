import { Command } from "discord-akairo";
import { User, Message, MessageEmbed } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util";

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
		return message.channel.send(new MessageEmbed({
			color: await getMemberColorAsync(message),
			title: user.tag,
			description: `[Link](${user.displayAvatarURL({ size: 2048, dynamic: true })})`,
			image: { url: user.displayAvatarURL({ size: 2048, dynamic: true }) },
			footer: { text: "ID: " + user.id },
		}));
	}
}