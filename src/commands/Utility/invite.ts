import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
export default class InviteCommand extends Command {
	constructor() {
		super("invite", {
			aliases: ["invite", "inv"],
			description: { description: "Get a link to invite the bot to your server.", usage: "" },
		});
	}
	public async exec(message: Message): Promise<Message> {
		return message.channel.send(new MessageEmbed({
			title: "Invite link",
			description: `[Link](https://discord.com/oauth2/authorize?client_id=${this.client.user?.id}&scope=bot)`,
			image: { url: this.client.user?.displayAvatarURL({ size: 128, dynamic: true }) },
		})
			.withOkColor(message));
	}
}