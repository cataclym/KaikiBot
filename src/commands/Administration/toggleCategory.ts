import { Category, Command } from "@cataclym/discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { blockedModulesCache } from "../../cache/cache.js";
import { noArgGeneric } from "../../lib/Embeds.js";
import { getGuildDB } from "../../struct/db.js";

export default class ToggleCategoryCommand extends Command {
	constructor() {
		super("togglecategory", {
			aliases: ["togglecategory", "tc"],
			userPermissions: "ADMINISTRATOR",
			channel: "guild",
			description: { description: "Toggles a category", usage: "Anime" },
			args: [
				{
					id: "category",
					type: (_, phrase) => {
						return this.handler.categories.find((__, k) => {

							k = k.toLowerCase();

							return phrase
								.toLowerCase()
								.startsWith(k.slice(0, Math.max(phrase.length - 1, 1)));
						});
					},
					otherwise: (msg: Message) => noArgGeneric(msg),
				},
			],

		});
	}
	public async exec(message: Message, { category }: {category: Category<string, Command>}): Promise<Message> {

		const guild = (message.guild as Guild);
		const db = await getGuildDB(guild.id);
		const bool = !db.blockedCategories[category.id];

		blockedModulesCache[guild.id][category.id] = bool;
		db.blockedCategories[category.id] = bool;
		db.markModified("blockedCategories");
		db.save();

		return message.channel.send(new MessageEmbed()
			.setDescription(`${category.id} has been ${bool ? "disabled" : "enabled"}.`)
			.withOkColor(message),
		);
	}
}