import { Command } from "@cataclym/discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Snowflake } from "discord-api-types";
import { Guild, Message, MessageEmbed } from "discord.js";
import { trim } from "../../lib/Util";
import { getGuildDocument } from "../../struct/documentMethods";

export default class EmoteCount extends Command {
	constructor() {
		super("emotecount", {
			cooldown: 15000,
			aliases: ["emotecount", "emojicount", "ec"],
			description: { description: "Shows amount of times each emote has been used", usage: ["", "-s", "--small"] },
			channel: "guild",
			args: [{
				id: "flag",
				flag: ["--small", "-s"],
				match: "flag",
			}],
		});
	}

	public async exec(message: Message, { flag }: { flag: boolean }): Promise<Message | void> {

		const data: string[] = [],
			pages: MessageEmbed[] = [],
			guildDB = await getGuildDocument((message.guild as Guild).id),
			GuildEmoteCount = guildDB.emojiStats,

			baseEmbed = new MessageEmbed()
				.setTitle("Emote count")
				.setAuthor(message.guild?.name)
				.withOkColor(message),

			emoteDataPair = Object
				.entries(GuildEmoteCount)
				.sort((a, b) => b[1] - a[1]);

		for (const [key, value] of emoteDataPair) {

			const Emote = (message.guild as Guild).emojis.cache.get(key as Snowflake);

			if (!Emote) continue;

			if (!flag) data.push(`\`${value}\` ${Emote} | ${Emote.name}`);
			else data.push(`${Emote} \`${value}\` `);
		}

		if (!flag) {

			for (let i = 25, p = 0; p < data.length; i = i + 25, p = p + 25) {

				pages.push(new MessageEmbed(baseEmbed)
					.setDescription(trim(data.slice(p, i).join("\n"), 2048)),
				);
			}
		}

		else {

			for (let i = 50, p = 0; p < data.length; i = i + 50, p = p + 50) {

				pages.push(new MessageEmbed(baseEmbed)
					.setDescription(trim(data.slice(p, i).join(""), 2048)),
				);
			}
		}
		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
}
