import { GuildMember, Message, MessageEmbed, User } from "discord.js";
import { Command, PrefixSupplier } from "discord-akairo";

export default class MentionCommand extends Command {
	constructor() {
		super("mention");
	}

	condition(msg: Message): boolean {
		return msg.mentions.has(msg.client.user as User, { ignoreDirect: false, ignoreEveryone: true, ignoreRoles: true }) && !msg.author.bot;
	}

	public async exec(msg: Message): Promise<Message> {
		const embed = new MessageEmbed({
			title: `Hi ${msg.author.username}, what's up?`,
			description: `If you need help type \`${(this.handler.prefix as PrefixSupplier)(msg)}help\`.`,
			color: await (msg.member as GuildMember).getMemberColorAsync(),
		});
		return msg.channel.send(embed);
	}
}