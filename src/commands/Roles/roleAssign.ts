import { Command } from "discord-akairo";
import { GuildMember, Message, MessageEmbed, Role } from "discord.js";

export default class RoleAssignCommand extends Command {
	constructor() {
		super("roleassign", {
			aliases: ["roleassign", "setrole", "sr"],
			description: { description: "Gives a role to a user. The role you specify has to be lower in the role hierarchy than your highest role.", usage: "@Dreb Gamer" },
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
						.withOkColor(m),
				},
				{
					id: "role",
					type: "role",
					otherwise: (m: Message) => new MessageEmbed({
						title: "Can't find a matching role. Try again.",
					})
						.withOkColor(m),

				},
			],
		});
	}
	public async exec(message: Message, { member, role }: { member: GuildMember, role: Role }): Promise<Message> {

		if ((role.position < (message.member as GuildMember).roles.highest.position) && !role.managed || message.guild?.ownerID === message.member?.id) {
			if (!member.roles.cache.has(role.id)) {

				await member.roles.add(role);

				return message.channel.send({ embeds: [new MessageEmbed({
					title: "Success!",
					description: `Added ${role} to ${member.user}`,
				})
					.withOkColor(message)],
				});
			}
			else {
				return message.channel.send({ embeds: [new MessageEmbed({
					title: "Error",
					description: `${member} already has ${role}`,
				})
					.withErrorColor(message)],
				});
			}
		}
		else {
			return message.channel.send({ embeds: [new MessageEmbed({
				title: "Insufficient permission(s).",
			})
				.withErrorColor(message)],
			});
		}
	}
}
