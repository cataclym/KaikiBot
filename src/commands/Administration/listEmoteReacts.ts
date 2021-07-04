import { PrefixSupplier } from "discord-akairo";
import { sendPaginatedMessage } from "@cataclym/discord.js-pagination-ts-nsb";
import { Snowflake } from "discord-api-types";
import { Message, MessageEmbed } from "discord.js";
import { getGuildDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class RemoveEmoteReactCommand extends KaikiCommand {
	constructor() {
		super("listreacts", {
			aliases: ["listreacts", "ler"],
			channel: "guild",
			description: "List emotereact triggers.",
			usage: [""],
		});
	}

	public async exec(message: Message): Promise<Message> {

		const gid = message.guild!.id,
			db = await getGuildDocument(gid),
			emojis = Object.entries(db.emojiReactions),
			pages: MessageEmbed[] = [];

		if (!emojis?.length) {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setTitle("No triggers")
					.setDescription(`Add triggers with ${(this.handler.prefix as PrefixSupplier)(message)}aer`)
					.withErrorColor(message)],
			});
		}

		for (let index = 15, p = 0; p < emojis.length; index += 15, p += 15) {

			pages.push(new MessageEmbed()
				.setTitle("Emoji triggers")
				.setDescription(emojis.slice(p, index).map(([t, e]) => {
					return `**${t}** => ${message.guild?.emojis.cache.get(e as Snowflake) ?? e}`;
				}).join("\n"))
				.withOkColor(message));
		}

		return sendPaginatedMessage(message, pages, {});
	}
}
