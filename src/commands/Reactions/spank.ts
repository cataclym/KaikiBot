import { Command } from "@cataclym/discord-akairo";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import sendNekosPics from "../../lib/nekos.life";

export default class spank extends Command {
	constructor() {
		super("spank", {
			aliases: ["spank"],
			description: { description: "OwO Being naughty are we?",
				usage: ["", "@dreb"] },
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
			return message.channel.send(await sendNekosPics(message, "spank", mention));
		}

		else {
			return message.channel.send(new MessageEmbed({
				title: "Error",
				description: "Channel is not NSFW.",
			})
				.withErrorColor(message));
		}
	}
}