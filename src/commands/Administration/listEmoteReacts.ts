import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Message, MessageEmbed } from "discord.js";
import { getGuildDB } from "../../struct/db";

export default class RemoveEmoteReactCommand extends Command {
	constructor() {
		super("listreacts", {
			aliases: ["listreacts", "ler"],
			channel: "guild",
			description: { description: "List emotereact triggers.",
				usage: ["anime"] },
		});
	}

	public async exec(message: Message): Promise<Message> {

		const gid = message.guild!.id,
			db = await getGuildDB(gid),
			emojies = Object.entries(db.emojiReactions),
			pages: MessageEmbed[] = [];

		if (!emojies?.length) {
			return message.channel.send(new MessageEmbed()
				.setTitle("No triggers")
				.setDescription(`Add triggers with ${(this.handler.prefix as PrefixSupplier)(message)}aer`)
				.withErrorColor(message),
			);
		}

		for (let index = 15, p = 0; p < emojies.length; index += 15, p += 15) {

			pages.push(new MessageEmbed()
				.setTitle("Emoji triggers")
				.setDescription(emojies.slice(p, index).map(([t, e]) => {
					return `**${t}** => ${message.guild?.emojis.cache.get(e) ?? e}`;
				}))
				.withOkColor(message),
			);
		}

		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
}