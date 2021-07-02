import { GuildMember, Message, MessageEmbed } from "discord.js";
import sendNekosPics from "../../lib/nekos.life";
import { KaikiCommand } from "Kaiki";

export default class spank extends KaikiCommand {
	constructor() {
		super("spank", {
			aliases: ["spank"],
			description: "OwO Being naughty are we?",
			usage: ["", "@dreb"],
			typing: true,
			args: [{
				id: "mention",
				type: "member",
				default: null,
			}],
		});
	}

	public async exec(message: Message, { mention }: { mention: GuildMember | null }): Promise<Message> {
		if (message.channel.type === "text" && message.channel.nsfw) {
			return message.channel.send({ embeds: [await sendNekosPics(message, "spank", mention)] });
		}

		else {
			return message.channel.send({
				embeds: [new MessageEmbed({
					title: "Error",
					description: "Channel is not NSFW.",
				})
					.withErrorColor(message)],
			});
		}
	}
}
