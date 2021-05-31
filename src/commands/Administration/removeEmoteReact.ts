import { Command } from "@cataclym/discord-akairo";
import { Snowflake } from "discord-api-types";
import { Message, MessageEmbed } from "discord.js";
import { getGuildDB } from "../../struct/db";

export default class RemoveEmoteReactCommand extends Command {
	constructor() {
		super("removereact", {
			aliases: ["removereact", "rer"],
			userPermissions: "MANAGE_EMOJIS",
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
			emojiID = db.emojiReactions[trigger],
			emoji = message.guild?.emojis.cache.get(emojiID as Snowflake);

		if (db.emojiReactions[trigger]) {

			delete db.emojiReactions[trigger];
			db.markModified("emojiReactions");
			db.save();

			return message.channel.send(new MessageEmbed()
				.setTitle("Removed emoji trigger")
				.setDescription(`Saying \`${trigger}\` will no longer force me to react with ${emoji?.name ?? emojiID}`)
				.setThumbnail(emoji?.url ?? emojiID)
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