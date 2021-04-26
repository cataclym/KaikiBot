import { Command } from "@cataclym/discord-akairo";
import { GuildEmoji, Message, MessageEmbed } from "discord.js";
import { keyWordCache } from "../../cache/cache";
import { getGuildDB } from "../../struct/db";

export default class EmoteReactCommand extends Command {
	constructor() {
		super("addemotereact", {
			aliases: ["addemotereact", "emotereact", "aer"],
			userPermissions: "MANAGE_EMOJIS",
			clientPermissions: "ADD_REACTIONS",
			channel: "guild",
			description: { description: "Add triggers for the bot to react with emojis/emotes to. Use quotes for triggers with spaces.",
				usage: ["red :red:", "anime :weeaboosgetout:"] },
			args: [
				{
					id: "trigger",
					type: "string",
				},
				{
					id: "emoji",
					type: "emoji",
				},
			],
		});
	}

	public async exec(message: Message, { trigger, emoji }: { trigger: string, emoji: GuildEmoji }): Promise<Message> {

		const gid = message.guild!.id,
			db = await getGuildDB(gid);
		db.emojiReactions[trigger] = emoji.id;
		keyWordCache[gid][trigger] = emoji.id;
		db.markModified(`emojiReactions.${trigger}`);
		db.save();

		return message.channel.send(new MessageEmbed()
			.setTitle("New emoji trigger added")
			.setDescription(`Saying \`${trigger}\` will force me to react with ${emoji}`)
			.setThumbnail(emoji.url)
			.withOkColor(message),
		);
	}
}