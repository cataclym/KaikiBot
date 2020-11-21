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
			}],
		});
	}

	public async exec(message: Message, { flag }: { flag: boolean }): Promise<Message | void> {

		const data = [];
		const pages = [];
		const color = await getMemberColorAsync(message);
		const GuildEmoteCount = Emotes.get(`${message.guild?.id}`);

		if (GuildEmoteCount) {

			for (const [key, value] of Object.entries(GuildEmoteCount).sort((a: [string, number], b: [string, number]) => a[1] - b[1])) {
				const Emote = message.guild?.emojis.cache.get(key);
				if (!Emote) {
					continue;
				}

				if (!flag) { data.push(`\`${Object.values(value as string)}\` ${Emote} | ${Emote.name}`); }
				else { data.push(`${Emote} \`${Object.values(value as string)}\` `); }
			}

			if (!flag) {

				for (let i = 25, p = 0; p < data.length; i = i + 25, p = p + 25) {

					const dEmbed = new MessageEmbed()
						.setTitle("Emoji count list")
						.setAuthor(message.guild?.name)
						.setColor(color)
						.setDescription(trim(data.slice(p, i).join("\n"), 2048));
					pages.push(dEmbed);
				}
			}
			else {

				for (let i = 50, p = 0; p < data.length; i = i + 50, p = p + 50) {

					const dEmbed = new MessageEmbed()
						.setTitle("Emoji count list")
						.setAuthor(message.guild?.name)
						.setColor(color)
						.setDescription(trim(data.slice(p, i).join(""), 2048));
					pages.push(dEmbed);
				}
			}
			return editMessageWithPaginatedEmbeds(message, pages, {});
		}
	}
}
