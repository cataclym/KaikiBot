import { Message, MessageEmbed, User } from "discord.js";
import { getMemberColorAsync } from "../../util/Util";
import { Command, PrefixSupplier } from "discord-akairo";

export default class MentionCommand extends Command {
	constructor() {
		super("mention", {
			category: "etc",
		});
	}

	condition(msg: Message): boolean {
		return msg.mentions.has(msg.client.user as User, { ignoreDirect: false, ignoreEveryone: true, ignoreRoles: true }) && !msg.author.bot;
	}

	public async exec(msg: Message): Promise<Message> {
		const embed = new MessageEmbed({
			title: `Hi ${msg.author.username}, what's up?`,
			description: `If you need help type \`${(this.handler.prefix as PrefixSupplier)(msg)}help\`.`,
			color: await getMemberColorAsync(msg),
		});
		return msg.channel.send(embed);
	}
}