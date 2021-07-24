import { PrefixSupplier } from "discord-akairo";
import { Message, MessageEmbed, User } from "discord.js";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class MentionCommand extends KaikiCommand {
	constructor() {
		super("mention", {
			channel: "guild",
			editable: false,
		});
	}

	condition(msg: Message): boolean {
		return msg.mentions.has(msg.client.user as User, { ignoreDirect: false, ignoreEveryone: true, ignoreRoles: true }) && !msg.author.bot && msg.content.split(" ").length === 1;
	}

	public async exec(msg: Message): Promise<NodeJS.Timeout> {

		const embed = msg.channel.send({
			embeds: [new MessageEmbed({
				title: `Hi ${msg.author.username}, what's up?`,
				description: `If you need help type \`${(this.handler.prefix as PrefixSupplier)(msg)}help\`.`,
			})
				.withOkColor(msg)],
		});

		return setTimeout(async () => (await embed).delete(), 10000).unref();
	}
}
