import { Guild, GuildEmoji, Message, MessageEmbed, Permissions } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { KaikiCommand } from "kaiki";

import { getGuildDocument } from "../../struct/documentMethods";

export default class EmoteReactCommand extends KaikiCommand {
	constructor() {
		super("addemotereact", {
			aliases: ["addemotereact", "emotereact", "aer"],
			userPermissions: Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS,
			clientPermissions:  Permissions.FLAGS.ADD_REACTIONS,
			channel: "guild",
			description: "Add triggers for the bot to react with emojis/emotes to. Use quotes for triggers with spaces.",
			usage: ["red :red:", "anime :weeaboosgetout:"],
			args: [
				{
					id: "trigger",
					type: "string",
					otherwise: (m: Message) => ({ embeds: [noArgGeneric(m)] }),
				},
				{
					id: "emoji",
					type: "emoji",
					otherwise: (m: Message) => ({ embeds: [noArgGeneric(m)] }),
				},
			],
		});
	}

	public async exec(message: Message, { trigger, emoji }: { trigger: string, emoji: GuildEmoji }): Promise<Message> {

		trigger = trigger.toLowerCase();
		const gid = (message.guild as Guild).id,
			db = await getGuildDocument(gid);
		db.emojiReactions[trigger] = emoji.id;
		db.markModified(`emojiReactions.${trigger}`);
		db.save();

		return message.channel.send({ embeds:
			[new MessageEmbed()
				.setTitle("New emoji trigger added")
				.setDescription(`Saying \`${trigger}\` will force me to react with ${emoji}`)
				.setThumbnail(emoji.url)
				.withOkColor(message)],
		});
	}
}
