import { Snowflake } from "discord-api-types";
import { Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "../../lib/KaikiClass";
import { getGuildDocument } from "../../struct/documentMethods";

export default class RemoveEmoteReactCommand extends KaikiCommand {
	constructor() {
		super("removereact", {
			aliases: ["removereact", "rer"],
			userPermissions: "MANAGE_EMOJIS",
			channel: "guild",
			description: "Remove emotereact triggers.",
			usage: ["anime"],
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
			db = await getGuildDocument(gid),
			emojiID = db.emojiReactions[trigger],
			emoji = message.guild?.emojis.cache.get(emojiID as Snowflake);

		if (db.emojiReactions[trigger]) {

			delete db.emojiReactions[trigger];
			db.markModified("emojiReactions");
			await db.save();

			const embed = new MessageEmbed()
				.setTitle("Removed emoji trigger")
				.setDescription(`Saying \`${trigger}\` will no longer force me to react with \`${emoji?.name ?? "missing emote"}\``)
				.withOkColor(message);

			if (emoji) embed.setThumbnail(emoji.url);

			return message.channel.send({ embeds: [embed] });
		}

		else {
			await db.save();
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setTitle("Not found")
					.setDescription("Trigger not found in the database")
					.withErrorColor(message)],
			});
		}
	}
}
