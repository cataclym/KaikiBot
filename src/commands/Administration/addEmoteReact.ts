import { Guild, GuildEmoji, Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "../../lib/KaikiClass";
import { noArgGeneric } from "../../lib/Embeds";
import { getGuildDocument } from "../../struct/documentMethods";

export default class EmoteReactCommand extends KaikiCommand {
	constructor() {
		super("addemotereact", {
			aliases: ["addemotereact", "emotereact", "aer"],
			userPermissions: "MANAGE_EMOJIS",
			clientPermissions: "ADD_REACTIONS",
			channel: "guild",
			description: "Add triggers for the bot to react with emojis/emotes to. Use quotes for triggers with spaces.",
			usage: ["red :red:", "anime :weeaboosgetout:"],
			args: [
				{
					id: "trigger",
					type: "string",
					otherwise: (m: Message) => noArgGeneric(m),
				},
				{
					id: "emoji",
					type: "emoji",
					otherwise: (m: Message) => noArgGeneric(m),
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
