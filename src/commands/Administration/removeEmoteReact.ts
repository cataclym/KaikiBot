import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { keyWordCache } from "../../nsb/functions";
import { getGuildDB } from "../../struct/db";

export default class RemoveEmoteReactCommand extends Command {
	constructor() {
		super("removereact", {
			aliases: ["removereact", "rer"],
			channel: "guild",
			description: { description: "Remove emotereact triggers.",
				usage: ["anime"] },
			args: [
				{
					id: "trigger",
					type: "string",
				},
			],
		});
	}

	public async exec(message: Message, { trigger }: { trigger: string }): Promise<Message> {

		const gid = message.guild!.id,
			db = await getGuildDB(gid),
			emoji = message.guild?.emojis.cache.get(keyWordCache[gid][trigger]);

		if (db.emojiReactions[trigger]) {

			delete db.emojiReactions[trigger];
			delete keyWordCache[gid][trigger];
			db.markModified("emojiReactions");
			db.save();

			return message.channel.send(new MessageEmbed()
				.setTitle("Removed emoji trigger")
				.setDescription(`Saying \`${trigger}\` will no longer force me to react with ${emoji?.name ?? keyWordCache[gid][trigger]}`)
				.setThumbnail(emoji!.url)
				.withOkColor(message),
			);
		}

		else {
			db.save();
			return message.channel.send(new MessageEmbed()
				.setTitle("Not found")
				.setDescription("Trigger not found in the database")
				.withErrorColor(message),
			);
		}
	}
}