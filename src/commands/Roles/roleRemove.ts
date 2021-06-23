import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, Role, GuildMember } from "discord.js";

export default class RoleRemoveCommand extends Command {
	constructor() {
		super("roleremove", {
			aliases: ["roleremove", "removerole", "rr"],
			description: { description: "Takes away a user's role. The role you specify has to be lower in the role hierarchy than your highest role.", usage: "@Dreb Gamer" },
			clientPermissions: "MANAGE_ROLES",
			userPermissions: "MANAGE_ROLES",
			channel: "guild",
			args: [
				{
					id: "member",
					type: "member",
					otherwise: (m: Message) => new MessageEmbed({
						title: "Can't find this user. Try again.",
					})
						.withErrorColor(m),
				},
				{
					id: "role",
					type: "role",
					otherwise: (m: Message) => new MessageEmbed({
						title: "Can't find a matching role. Try again.",
					})
						.withErrorColor(m),
				},
			],
		});
	}
	public async exec(message: Message, { member, role }: { member: GuildMember, role: Role }): Promise<Message> {

		if ((role.position < (message.member as GuildMember).roles.highest.position) && !role.managed) {
			if (member.roles.cache.has(role.id)) {

				await member.roles.remove(role);

				return message.channel.send({ embeds: [new MessageEmbed({
					title: "Success!",
					description: `Removed ${role} from ${member.user}`,
				})
					.withOkColor(message)],
				});
			}

			else {
				return message.channel.send({
					embeds: [new MessageEmbed({
						title: "Error",
						description: `${member} doesn't have ${role}`,
					})
						.withErrorColor(message)],
				});
			}
		}

		else {
			return message.channel.send({
				embeds: [new MessageEmbed({
					title: "Insufficient permission(s).",
				})
					.withErrorColor(message)],
			});
		}
	}
}