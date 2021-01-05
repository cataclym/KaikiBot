import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Command } from "@cataclym/discord-akairo";
import { Guild, Role, MessageEmbed, Message } from "discord.js";

export default class RoleListCommand extends Command {
	constructor() {
		super("rolelist", {
			aliases: ["rolelist", "roles"],
			description: { description: "Lists all roles", usage: "" },
			channel: "guild",
		});
	}

	public async exec(message: Message): Promise<Message> {

		const roleArray = (message.guild as Guild).roles.cache.array();
		const data: Role[] = roleArray.sort((a: Role, b: Role) => b.position - a.position || (b.id as unknown as number) - (a.id as unknown as number));

		const pages: MessageEmbed[] = [];

		if (data) {
			for (let i = 50, p = 0; p < data.length; i = i + 50, p = p + 50) {
				const dEmbed = new MessageEmbed()
					.setTitle(`Role list (${roleArray.length})`)
					.setAuthor(message.guild?.name)
					.setColor(await message.getMemberColorAsync())
					.addField("\u200B", data.slice(p, i - 25).join("\n"), true);
				if (data.slice(p, i).length > 25) {
					dEmbed.addField("\u200B", data.slice(p + 25, i).join("\n"), true);
				}
				pages.push(dEmbed);
			}
		}
		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
}