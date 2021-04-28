import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Guild, Message, MessageEmbed } from "discord.js";
import { getGuildDB } from "../../struct/db";

export default class ListUserRoles extends Command {
	constructor() {
		super("listuserroles", {
			aliases: ["listuserroles", "lur"],
			description: { description: "List all custom assigned roles.", usage: "" },
			prefix: (msg: Message) => {
				const p = (this.handler.prefix as PrefixSupplier)(msg);
				return [p as string, ";"];
			},
			channel: "guild",
		});
	}
	public async exec(message: Message): Promise<Message> {

		const guildID = (message.guild as Guild).id,
			db = await getGuildDB(guildID);
		const roles = Object.entries(db.userRoles);

		if (roles.length) {

			const mapped = roles.sort().map(([u, r]) => `${message.guild?.members.cache.get(u) || u}: ${message.guild?.roles.cache.get(r) || r}`),
				pages: MessageEmbed[] = [];

			for (let items = 20, from = 0; mapped.length > from; items += 20, from += 20) {

				const pageRoles = mapped.slice(from, items);

				pages.push(new MessageEmbed()
					.setTitle("Custom Userroles")
					.setDescription(pageRoles.join("\n"))
					.withOkColor(message));
			}

			return editMessageWithPaginatedEmbeds(message, pages, {});
		}

		else {
			return message.channel.send(new MessageEmbed()
				.withErrorColor(message)
				.setTitle("No user roles")
				.setDescription("This guild has not used this feature yet."),
			);
		}
	}
}