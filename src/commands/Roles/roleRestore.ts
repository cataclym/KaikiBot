import { Command } from "@cataclym/discord-akairo";
import { Snowflake } from "discord-api-types";
import { Guild, GuildMember, Message, MessageEmbed, Permissions } from "discord.js";
import { getGuildDocument } from "../../struct/documentMethods";
import logger from "loglevel";
import { trim } from "../../lib/Util";

export default class RestoreUserRoles extends Command {
	constructor() {
		super("restore", {
			aliases: ["restore"],
			userPermissions: ["ADMINISTRATOR", "MANAGE_ROLES"],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			description: { description: "Restores roles for a user who has previously left the server.", usage: "@dreb" },
			channel: "guild",
			args: [
				{
					id: "member",
					type: "member",
					prompt: {
						start: "Specify a member?",
						retry: "I-I-Invalid member! Please try again...",
					},
				},
			],
		});
	}
	public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message | void> {

		const guild = message.guild as Guild,
			db = await getGuildDocument(guild.id),
			leaveRoles = db.leaveRoles[member.id];

		if (leaveRoles && leaveRoles.length) {

			const roleIDArray = leaveRoles
				.map(roleString => guild.roles.cache.get(roleString as Snowflake))
				.filter(r => r?.position !== 0)
				.filter(Boolean);

			if (roleIDArray.every(r => r!.position > message.guild!.me!.roles.highest.position)) throw new Error("One or more roles' position is too high for me to add");

			const rolesToAdd = roleIDArray.filter(r => !member.roles.cache.has(r!.id));

			if (!rolesToAdd.length) {
				return message.channel.send(new MessageEmbed()
					.setDescription("This member already has all the roles.")
					.withErrorColor(message),
				);
			}

			await member.roles.add(rolesToAdd.map(r => r!.id));

			return message.channel.send(new MessageEmbed()
				.setDescription(`Restored roles of ${member.user.tag}`)
				.addField("Added Roles", trim(rolesToAdd.join("\n"), 1024))
				.withOkColor(message),
			);
		}

		else {
			return message.channel.send(new MessageEmbed()
				.setDescription("This user's roles have not been saved, or user has never left the guild.")
				.withErrorColor(message),
			);
		}
	}
}
