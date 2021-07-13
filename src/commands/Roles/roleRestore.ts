import { Snowflake } from "discord-api-types";
import { Guild, GuildMember, Message, MessageEmbed, Permissions } from "discord.js";
import { getGuildDocument } from "../../struct/documentMethods";
import { trim } from "../../lib/Util";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class RestoreUserRoles extends KaikiCommand {
	constructor() {
		super("restore", {
			aliases: ["restore"],
			userPermissions: ["ADMINISTRATOR"],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			description: "Restores roles for a user who has previously left the server.",
			usage: "@dreb",
			channel: "guild",
			args: [
				{
					id: "member",
					type: "member",
					otherwise: (m) => new MessageEmbed()
						.setDescription("Please provide a valid member")
						.withErrorColor(m),
				},
			],
		});
	}
	public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message | void> {

		const guild = message.guild as Guild,
			db = await getGuildDocument(guild.id),
			leaveRoles = db.leaveRoles[member.id];

		if (leaveRoles && leaveRoles.length) {

			// Get all roles that still exist in guild.
			// Filter everyone role
			// Then filter out undefined.
			const roleIDArray = leaveRoles
				.map(roleString => guild.roles.cache.get(roleString as Snowflake))
				.filter(r => r?.position !== 0)
				.filter(Boolean);

			if (roleIDArray.every(r => r!.position > message.guild!.me!.roles.highest.position)) throw new Error("One or more roles are above me in the hierarchy");

			// Making sure bot doesn't add roles the user already have
			const rolesToAdd = roleIDArray.filter(r => !member.roles.cache.has(r!.id));

			if (!rolesToAdd.length) {
				return message.channel.send({
					embeds: [new MessageEmbed()
						.setDescription("This member already has all the roles.")
						.withErrorColor(message)],
				});
			}

			// Add all roles
			// Map roles to ID, because D.js didn't like it otherwise
			await member.roles.add(rolesToAdd.map(r => r!.id));

			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`Restored roles of \`${member.user.tag}\` [${member.id}]`)
					.addField("Roles added", trim(rolesToAdd.join("\n"), 1024))
					.withOkColor(message)],
			});
		}

		else {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription("This user's roles have not been saved, or they have not left the guild.")
					.withErrorColor(message)],
			});
		}
	}
}
