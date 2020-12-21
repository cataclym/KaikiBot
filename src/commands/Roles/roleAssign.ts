import { Command } from "discord-akairo";
import { Message, MessageEmbed, Role, GuildMember } from "discord.js";
import { errorColor } from "../../util/Util";

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
					otherwise: () => new MessageEmbed({
						title: "Can't find this user. Try again.",
						color: errorColor,
					}),
				},
				{
					id: "role",
					type: "role",
					otherwise: () => new MessageEmbed({
						title: "Can't find a matching role. Try again.",
						color: errorColor,
					}),
				},
			],
		});
	}
	public async exec(message: Message, { member, role }: { member: GuildMember, role: Role }): Promise<Message> {

		if ((role.position < (message.member as GuildMember).roles.highest.position) && !role.managed) {
			if (!member.roles.cache.has(role.id)) {

				await member.roles.add(role);

				return message.channel.send(new MessageEmbed({
					title: "Success!",
					description: `Added ${role} to ${member.user}`,
					color: await message.getMemberColorAsync(),
				}));
			}
			else {
				return message.channel.send(new MessageEmbed({
					title: "Error",
					description: `${member} already has ${role}`,
					color: errorColor,
				}));
			}
		}
		else {
			return message.channel.send(new MessageEmbed({
				title: "Insufficient permission(s).",
				color: errorColor,
			}));
		}
	}
}