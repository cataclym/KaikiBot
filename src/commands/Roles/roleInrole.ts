import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Command } from "discord-akairo";
import { GuildMember } from "discord.js";
import { Role, MessageEmbed, Message } from "discord.js";
import { errorColor, getMemberColorAsync } from "../../functions/Util";

export default class RoleInRoleCommand extends Command {
	constructor() {
		super("inrole", {
			aliases: ["inrole"],
			description: { description: "Lists all users in role", usage: "" },
			channel: "guild",
			args: [
				{
					id: "role",
					type: "role",
					otherwise: async (message: Message) => message.member?.roles.highest,
				},
			],
		});
	}

	public async exec(message: Message, { role }: { role: Role }): Promise<Message | void> {

		const data = role.members.array().sort((a: GuildMember, b: GuildMember) => b.roles.highest.position - a.roles.highest.position || (b.id as unknown as number) - (a.id as unknown as number));

		const pages: MessageEmbed[] = [];

		if (data && data.length) {

			for (let i = 50, p = 0; p < data.length; i = i + 50, p = p + 50) {

				const currentPageUsers = data.slice(p, i);

				pages.push(new MessageEmbed()
					.setTitle(`Users in ${role.name} (${currentPageUsers.length})`)
					.setAuthor(message.guild?.name)
					.setColor(await getMemberColorAsync(message))
					// .setDescription(data.slice(p, i).join(", "))
					.addFields([
						{ name: "•", value: currentPageUsers.slice(0, currentPageUsers.length / 3).join("\n") + "\n-", inline: true },
						{ name: "•", value: currentPageUsers.slice(currentPageUsers.length / 3, (currentPageUsers.length / 3) + (currentPageUsers.length / 3)).join("\n") + "\n-", inline: true },
						{ name: "•", value: currentPageUsers.slice(currentPageUsers.length - currentPageUsers.length / 3).join("\n") + "\n-", inline: true },
					]),
				);
			}
			return editMessageWithPaginatedEmbeds(message, pages, {});
		}
		else {
			return editMessageWithPaginatedEmbeds(message, [new MessageEmbed({
				title: `No users in ${role.name}`,
				color: errorColor,
			})], {});
		}
	}
}