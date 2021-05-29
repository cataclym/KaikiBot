import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, User } from "discord.js";

export default class MentionCommand extends Command {
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

		const embed = msg.channel.send(new MessageEmbed({
			title: `Hi ${msg.author.username}, what's up?`,
			description: `If you need help type \`${(this.handler.prefix as PrefixSupplier)(msg)}help\`.`,
		})
			.withOkColor(msg));

		return this.client.setTimeout(async () => (await embed).delete(), 10000);
	}
}