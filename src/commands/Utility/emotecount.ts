import db from "quick.db";
import { MessageEmbed, Message } from "discord.js";
const Emotes = new db.table("Emotes");
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Command } from "discord-akairo";
import { getMemberColorAsync, trim } from "../../functions/Util";

export default class EmoteCount extends Command {
	constructor() {
		super("emotecount", {
			cooldown: 15000,
			aliases: ["emotecount", "emojicount", "ec"],
			description: "Shows amount of times each emote has been used",
			channel: "guild",
			args: [{
				id: "flag",
				flag: ["--small", "-s"],
				match: "flag",
			}],
		});
	}

	public async exec(message: Message, { flag }: { flag: boolean }): Promise<Message | void> {

		const data = [];
		const pages = [];
		const color = await getMemberColorAsync(message);
		const GuildEmoteCount = Emotes.get(`${message.guild?.id}`);
		const baseEmbed = new MessageEmbed()
			.setTitle("Emote count")
			.setAuthor(message.guild?.name)
			.setColor(color);

		if (GuildEmoteCount) {

			for (const [key, value] of Object.entries(GuildEmoteCount).sort((a, b) => Object.values(b[1] as number)[0] - Object.values(a[1] as number)[0] || (a[1] as number) - (b[1] as number))) {
				const Emote = message.guild?.emojis.cache.get(key);
				if (!Emote) {
					continue;
				}

				if (!flag) { data.push(`\`${Object.values(value as string)}\` ${Emote} | ${Emote.name}`); }
				else { data.push(`${Emote} \`${Object.values(value as string)}\` `); }
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
}
