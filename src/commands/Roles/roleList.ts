import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Command } from "discord-akairo";
import { Role, MessageEmbed, Message } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util";

export default class RoleListCommand extends Command {
	constructor() {
		super("rolelist", {
			aliases: ["rolelist", "roles"],
			description: { description: "Lists all roles", usage: "" },
			channel: "guild",
		});
	}

	async exec(message: Message): Promise<Message> {

		const data: Role[] = [];
		message.guild?.roles.cache.forEach((r: Role) => data.push(r));

		const pages: MessageEmbed[] = [];

		for (let i = 50, p = 0; p < data.length; i = i + 50, p = p + 50) {
			const dEmbed = new MessageEmbed()
				.setTitle("Role list")
				.setAuthor(message.author.tag)
				.setColor(await getMemberColorAsync(message))
				.setDescription(data.slice(p, i).join(", "));
			pages.push(dEmbed);
		}
		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
}