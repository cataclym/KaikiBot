import { Command } from "@cataclym/discord-akairo";
import { Message, MessageReaction } from "discord.js";
import { noArgGeneric } from "../../nsb/Embeds";

export default class SaveChatCommand extends Command {
	constructor() {
		super("savechat", {
			aliases: ["savechat"],
			description: { description: "Saves a number of messages, and sends it to you.", usage: "100" },
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

		await message.member?.send(collection.map(m => {
			return `${m.createdAt.toTimeString().slice(0, 8)} ${m.createdAt.toDateString()}-\`${m.author.tag}\`: ` + m.content +
                (m.attachments ? m.attachments.map(a => a.url).join("\n") : "") +
                (m.embeds ? m.embeds.map(e => `Embed-${e.type || e.type}`).join("\n") : "");
		}).reverse().join("\n"), { split: true });

		return message.react("✅");
	}
}