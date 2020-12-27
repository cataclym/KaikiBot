import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Command } from "@cataclym/discord-akairo";
import { Role, MessageEmbed, Message } from "discord.js";

export default class RoleListCommand extends Command {
	constructor() {
		super("rolelist", {
			aliases: ["rolelist", "roles"],
			description: { description: "Lists all roles", usage: "" },
			channel: "guild",
		});
	}

	public async exec(message: Message): Promise<Message> {

		const data: Role[] | undefined = message.guild?.roles.cache.array().sort((a: Role, b: Role) => b.position - a.position || (b.id as unknown as number) - (a.id as unknown as number));

		const pages: MessageEmbed[] = [];

		if (data) {
			for (let i = 50, p = 0; p < data.length; i = i + 50, p = p + 50) {
				const dEmbed = new MessageEmbed()
					.setTitle("Role list")
					.setAuthor(message.guild?.name)
					.setColor(await message.getMemberColorAsync())
					.setDescription(data.slice(p, i).join(", "));
				pages.push(dEmbed);
			}
		}
		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
}