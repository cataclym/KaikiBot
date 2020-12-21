import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { Command } from "discord-akairo";
import { GuildMember } from "discord.js";
import { Role, MessageEmbed, Message } from "discord.js";
import { errorColor } from "../../util/Util";

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
					default: (message: Message) => message.member?.roles.highest,
				},
			],
		});
	}

	public async exec(message: Message, { role }: { role: Role }): Promise<Message> {

		const data = role.members.array().sort((a: GuildMember, b: GuildMember) => b.roles.highest.position - a.roles.highest.position || (a.id as unknown as number) - (b.id as unknown as number));

		const pages: MessageEmbed[] = [];

		if (data && data.length) {

			for (let i = 40, p = 0; p < data.length; i = i + 40, p = p + 40) {

				const currentPageUsers = data.slice(p, i);

				const emb = new MessageEmbed()
					.setTitle(`Users in ${role.name} (${data.length})`)
					.setAuthor(message.guild?.name)
					.setColor(await message.getMemberColorAsync())
					// .setDescription(data.slice(p, i).join(", "))
					.addFields([
						{ name: "•", value: currentPageUsers.slice(0, 20).map(u => `${u.user} - ${u.user.username}`).join("\n"), inline: true },
					]);
				if (currentPageUsers.length > 20) {
					emb.addField("•", currentPageUsers.slice(20, 40).map(u => `${u.user} - ${u.user.username}`).join("\n"), true);
				}
				pages.push(emb);
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