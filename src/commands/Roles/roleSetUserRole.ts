import { PrefixSupplier } from "discord-akairo";
import { Snowflake } from "discord-api-types";
import { Guild, GuildMember, Message, MessageEmbed, Role } from "discord.js";
import { IGuild } from "../../interfaces/IDocuments";
import { getGuildDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "kaiki";


// Rewrite of Miyano's setuserrole command
// https://github.com/PlatinumFT/Miyano-v2
// Thanks Plat.

export default class SetUserRoleCommand extends KaikiCommand {
	constructor() {
		super("setuserrole", {
			aliases: ["setuserrole", "sur"],
			description: "Assigns a role to a user.",
			usage: "@Platinum [role]",
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

	public async exec(message: Message, args: { member: GuildMember, role: Role }): Promise<Message | IGuild> {

		const { role, member } = args,
			guildID = (message.guild as Guild).id;

		const embedFail = async (text: string) => new MessageEmbed()
				.setDescription(text)
				.withErrorColor(message),

			embedSuccess = async (text: string) => new MessageEmbed()
				.setDescription(text)
				.withOkColor(message);

		const botRole = message.guild?.me?.roles.highest,
			isPosition = botRole?.comparePositionTo(role);

		if (!isPosition || (isPosition <= 0)) {
			return message.channel.send({ embeds: [await embedFail("This role is higher than me, I cannot add this role!")] });
		}

		else if (message.author.id !== message.guild?.ownerId &&
			(message.member as GuildMember).roles.highest.position < role.position) {

			return message.channel.send({ embeds: [await embedFail("This role is higher than your highest, I cannot add this role!")] });
		}

		const db = await getGuildDocument(guildID),
			roleID = db.userRoles[member.id];

		if (roleID) {

			const userRole = message.guild?.roles.cache.get(roleID as Snowflake);

			try {
				delete db.userRoles[member.id];
				await member.roles.remove(userRole ?? roleID as Snowflake);
				message.channel.send({ embeds: [await embedSuccess(`Removed role ${(userRole)?.name ?? roleID} from ${member.user.username}`)] });
			}

			catch (err) {
				throw new Error("Failed to delete user role.\n" + err);
			}
		}

		else {
			db.userRoles[member.id] = role.id;
			await member.roles.add(role);
			message.channel.send({ embeds: [await embedSuccess(`Adding role ${role.name} to ${member.user.username}`)] });
		}
		db.markModified("userRoles");
		return db.save();
	}
}
