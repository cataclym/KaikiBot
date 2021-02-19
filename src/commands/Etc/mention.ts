import { Message, MessageEmbed, User } from "discord.js";
import { Command, PrefixSupplier } from "@cataclym/discord-akairo";

export default class MentionCommand extends Command {
	constructor() {
		super("mention", {
			channel: "guild",
			editable: false,
		});
	}

	condition(msg: Message): boolean {
		return msg.mentions.has(msg.client.user as User, { ignoreDirect: false, ignoreEveryone: true, ignoreRoles: true }) && !msg.author.bot;
	}

	public async exec(msg: Message): Promise<Message> {

		const embed = msg.channel.send(new MessageEmbed({
			title: `Hi ${msg.author.username}, what's up?`,
			description: `If you need help type \`${(this.handler.prefix as PrefixSupplier)(msg)}help\`.`,
		})
			.withOkColor(msg));

		return (await embed).delete({ timeout: 10000 });
	}
}