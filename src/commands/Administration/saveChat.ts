import { Message, MessageReaction } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { KaikiCommand } from "Kaiki";

export default class SaveChatCommand extends KaikiCommand {
	constructor() {
		super("savechat", {
			aliases: ["savechat"],
			description: "Saves a number of messages, and sends it to you.",
			usage: "100",
			userPermissions: "MANAGE_MESSAGES",
			channel: "guild",
			args: [
				{
					id: "amount",
					type: "integer",
					otherwise: (msg: Message) => noArgGeneric(msg),
				},
			],
		});
	}
	public async exec(message: Message, { amount }: { amount: number}): Promise<MessageReaction> {

		if (amount > 100) amount = 100;

		const collection = await message.channel.messages.fetch({ limit: amount, before: message.id });

		await message.member?.send({
			content: collection.map(m => {
				return `${m.createdAt.toTimeString().slice(0, 8)} ${m.createdAt.toDateString()}-\`${m.author.tag}\`: ` + m.content +
                (m.attachments ? m.attachments.map(a => a.url).join("\n") : "");
			}).reverse().join("\n"),
		});

		return message.react("✅");
	}
}
