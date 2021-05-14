import { Argument, Category, Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { name, repository, version } from "../../../package.json";
import { noArgGeneric } from "../../lib/Embeds";

export default class commandsList extends Command {
	constructor() {
		super("cmdlist", {
			aliases: ["commands", "cmds", "cmdlist"],
			description: {
				description: "Shows categories, or commands if provided with a category.",
				usage: ["", "admin"] },

			args: [
				{
					id: "category",
					type: Argument.union((_, phrase) => {
						return this.handler.categories.find((__, k) => {

							k = k.toLowerCase();

							return phrase
								.toLowerCase()
								.startsWith(k.slice(0, Math.max(phrase.length - 1, 1)));
						});
					}, (__, _phrase) => _phrase.length <= 0
						? ""
						: undefined),
					// Thanks js
					otherwise: (msg: Message) => noArgGeneric(msg),

				},
			],
		});
	}

	public async exec(message: Message, { category }: { category: Category<string, Command>}): Promise<Message | undefined> {

		const prefix = (this.handler.prefix as PrefixSupplier)(message);

		if (category) {
			const embed = new MessageEmbed()
				.setTitle(`Commands in ${category.id}`)
				.withOkColor(message);
			{
				embed.setDescription(category
					.filter(cmd => cmd.aliases.length > 0)
					.map(cmd => `**${prefix}${cmd}** [\`${cmd.aliases.join("`, `")}\`]`)
					.join("\n") || "Empty");
			}
			return message.channel.send(embed);
		}

		else {
			const embed = new MessageEmbed({
				title: `List of command categories for ${this.client.user?.username}`,
				description: `Prefix is currently set to \`${prefix}\`\n`,
				author: {
					name: `${name} v${version}`,
					url: repository.url,
					icon_url: message.author.displayAvatarURL({ dynamic: true }),
				},
				thumbnail: {
					url: "https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png",
				},
				footer: {
					icon_url: (message.client.users.cache.get("140788173885276160") || (await message.client.users.fetch("140788173885276160", true)))
						.displayAvatarURL({ dynamic: true }),
				},
			})
				.withOkColor(message);

			for (const _category of this.handler.categories.values()) {
				if (["default", "Etc"].includes(_category.id)) continue;

				embed.addField(_category.id, `Commands: **${_category.size}**`);
			}
			return message.channel.send(embed);
		}
	}
}