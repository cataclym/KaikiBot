import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { Guild } from "discord.js";
import { GuildMember, MessageEmbed, Message, Role } from "discord.js";
import { errorColor } from "../../nsb/Util";

// Rewrite of Miyano's setuserrole command
// https://github.com/PlatinumFT/Miyano-v2
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

		const { role, member } = args,
			guildID = (message.guild as Guild).id;

		const embedFail = async (text: string) => {
				return new MessageEmbed()
					.setColor(errorColor)
					.setDescription(text);
			},
			embedSuccess = async (text: string) => {
				return new MessageEmbed()
					.setColor(await message.getMemberColorAsync())
					.setDescription(text);
			};

		const botRole = message.guild?.me?.roles.highest,
			isPosition = botRole?.comparePositionTo(role);

		if (!isPosition || (isPosition <= 0)) {
			return message.channel.send(await embedFail("This role is higher than me, I cannot add this role!"));
		}

		else if (message.author.id !== message.guild?.ownerID &&
			(message.member as GuildMember).roles.highest.position <= member.roles.highest.position) {

			return message.channel.send(await embedFail("This role is higher than your highest, I cannot add this role!"));
		}

		const dbRole = message.client.userRoles.get(guildID, member.id, null);

		if (dbRole) {

			const userRole = message.guild?.roles.cache.get(dbRole);

			try {
				message.client.userRoles.delete(guildID, member.id);
				await member.roles.remove(userRole ?? dbRole);
				return message.channel.send(await embedSuccess(`Removed role ${(userRole)?.name ?? dbRole} from ${member.user.username}`));
			}

			catch (err) {
				throw new Error("Failed to delete user role." + err);
			}
		}

		else {
			message.client.userRoles.set(guildID, member.id, role.id);
			await member.roles.add(role);
			return message.channel.send(await embedSuccess(`Adding role ${role.name} to ${member.user.username}`));
		}
	}
}