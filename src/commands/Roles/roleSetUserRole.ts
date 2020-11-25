import { Command } from "discord-akairo";
import { GuildMember, MessageEmbed, Message, Role } from "discord.js";
import { errorColor, getMemberColorAsync } from "../../util/Util";
import DB from "quick.db";
const userRoles = new DB.table("userRoles");

//
// Rewrite of Miyano's setuserrole command
//

export default class SetUserRoleCommand extends Command {
	constructor() {
		super("setuserrole", {
			aliases: ["setuserrole"],
			description: { description: "Assigns a role to a user.", usage: "setuserrole @Platinum [role]" },
			clientPermissions: ["MANAGE_ROLES"],
			userPermissions: ["MANAGE_ROLES"],
			args: [
				{
					id: "member",
					type: "member",
					otherwise: "Please specify a user to add!",
				},
				{
					id: "role",
					type: "role",
					otherwise: "Please specify a role to add!",
				},
			],
		});
	}
	public async exec(message: Message, args: { member: GuildMember, role: Role }): Promise<Message | void> {

		const { role, member } = args;

		async function embedFail(text: string) {
			const embed = new MessageEmbed()
				.setColor(errorColor)
				.setDescription(text);

			return embed;
		}

		async function embedSuccess(text: string) {
			const embed = new MessageEmbed()
				.setColor(await getMemberColorAsync(message))
				.setDescription(text);

			return embed;
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const botRole = message.guild?.me?.roles.highest;
		const isPosition = botRole?.comparePositionTo(role);

		if (isPosition && isPosition <= 0) return message.channel.send(await embedFail("This role is higher than me, I cannot add this role!"));

		// const res = await query(`SELECT * FROM user_roles WHERE role_id='${myRole.id}'`);
		const res = userRoles.get(`${message.guild?.id}.${member.id}`);

		console.log(res);

		if (res[0]) {
			if (userRoles.delete(`${message.guild?.id}.${member.id}`)) {

				// await query(`DELETE FROM user_roles where role_id='${myRole.id}'`);

				member.roles.remove(role);
				message.channel.send(await embedSuccess(`Removed role ${role.name} from ${member.user.username}`));
			}
			else {
				throw new Error("Failed to delete user role...?");
			}
		}
		else if (!res[0]) {

			const added = userRoles.push(`${message.guild?.id}`, `${member.id}`);

			console.log(added);

			member.roles.add(role);
			message.channel.send(await embedSuccess(`Adding role ${role.name} to ${member.user.username}`));
		}
	}
}