import { Command, PrefixSupplier } from "discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Snowflake } from "discord-api-types";
import { Guild, Message, MessageEmbed } from "discord.js";
import { getGuildDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "Kaiki";

export default class ListUserRoles extends KaikiCommand {
	constructor() {
		super("listuserroles", {
			aliases: ["listuserroles", "lur"],
			description: "List all custom assigned roles.",
			usage: "",
			prefix: (msg: Message) => {
				const p = (this.handler.prefix as PrefixSupplier)(msg);
				return [p as string, ";"];
			},
			channel: "guild",
		});
	}
	public async exec(message: Message): Promise<Message> {

		const guildID = (message.guild as Guild).id,
			db = await getGuildDocument(guildID);
		const roles = Object.entries(db.userRoles);

		if (roles.length) {

			const mapped = roles
					.map(([u, r]) => `${message.guild?.members.cache.get(u as Snowflake) || u}: ${message.guild?.roles.cache.get(r as Snowflake) || r}`)
					.sort(),
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
			return message.channel.send({
				embeds: [new MessageEmbed()
					.withErrorColor(message)
					.setTitle("No user roles")
					.setDescription("This guild has not used this feature yet.")],
			});
		}
	}
}
