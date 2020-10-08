import db from "quick.db";
import { MessageEmbed, Message } from "discord.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Emotes = new db.table("Emotes");
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Command } from "discord-akairo";
import { getMemberColorAsync } from "../../functions/Util";

module.exports = class EmoteCount extends Command {
	constructor() {
		super("emotecount", {
			cooldown: 15000,
			aliases: ["emotecount", "emojicount"],
			description: "Shows amount of times each emote has been used",
		});
	}

	async exec(message: Message) {

		const color = await getMemberColorAsync(message);
		const GuildEmoteCount = Emotes.get(`${message.guild?.id}`);
		const data = [];
		for (const [key, value] of Object.entries(GuildEmoteCount)) {
			const Emote = message.guild?.emojis.cache.get(key);
			if (!Emote) { continue; }
			data.push(`${Emote} \`${Object.values(value as any)}\` `);
		}
		const pages = [];
		for (let i = 50, p = 0; p < data.length; i = i + 50, p = p + 50) {
			const dEmbed = new MessageEmbed()
				.setTitle("Emoji count list")
				.setAuthor(message.author.tag)
				.setColor(color)
				.setDescription(data.slice(p, i).join(""));
			pages.push(dEmbed);
		}
		await editMessageWithPaginatedEmbeds(message, pages, {});
	}
};
