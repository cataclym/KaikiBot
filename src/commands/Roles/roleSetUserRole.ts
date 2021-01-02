import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { GuildMember, MessageEmbed, Message, Role } from "discord.js";
import { errorColor } from "../../nsb/Util";
import DB from "quick.db";
const userRoles = new DB.table("userRoles");

//
// Rewrite of Miyano's setuserrole command
// Thanks Plat.

export default class SetUserRoleCommand extends Command {
	constructor() {
		super("setuserrole", {
			aliases: ["setuserrole", "sur"],
			description: { description: "Assigns a role to a user.", usage: "@Platinum [role]" },
			clientPermissions: ["MANAGE_ROLES"],
			userPermissions: ["MANAGE_ROLES"],
			prefix: (msg: Message) => {
				const p = (this.handler.prefix as PrefixSupplier)(msg);
				return [p as string, ";"];
			},
			channel: "guild",
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

		const embedFail = async (text: string) => {
			return new MessageEmbed()
				.setColor(errorColor)
				.setDescription(text);
		};

		const embedSuccess = async (text: string) => {
			return new MessageEmbed()
				.setColor(await message.getMemberColorAsync())
				.setDescription(text);
		};

		const botRole = message.guild?.me?.roles.highest;
		const isPosition = botRole?.comparePositionTo(role);

		if (!isPosition || (isPosition <= 0)) return message.channel.send(await embedFail("This role is higher than me, I cannot add this role!"));

		const res = userRoles.get(`${message.guild?.id}.${member.id}`);

		if (res) {
			const userRole = message.guild?.roles.cache.get(res[0]);

			if (userRoles.delete(`${message.guild?.id}.${member.id}`)) {
				await member.roles.remove(userRole ?? res);
				return message.channel.send(await embedSuccess(`Removed role ${(userRole)?.name ?? res} from ${member.user.username}`));
			}

			else {
				throw new Error("Failed to delete user role...?");
			}
		}

		else {
			userRoles.push(`${message.guild?.id}.${member.id}`, `${role.id}`);
			await member.roles.add(role);
			return message.channel.send(await embedSuccess(`Adding role ${role.name} to ${member.user.username}`));
		}
	}
}