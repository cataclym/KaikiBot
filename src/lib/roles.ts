import { GuildMember } from "discord.js";
import logger from "loglevel";
import chalk from "chalk";
import { customClient } from "../struct/client";
import { getGuildDocument } from "../struct/documentMethods";
import { Snowflake } from "discord-api-types";

export async function handleStickyRoles(member: GuildMember) {

	if (!await (member.client as customClient).guildSettings.get(member.guild.id, "stickyRoles", false)) return;

	const result = await restoreUserRoles(member);
	if (!result) {
		logger.warn(`stickyRoles | Bot cannot add roles due to role-hierarchy!! ${chalk.blueBright(member.guild.name)} [${chalk.blueBright(member.guild.id)}]`);
	}
	else if (result.success) {
		logger.info(`stickyRoles | Re-added roles to ${chalk.blueBright(member.user.tag)} [${chalk.blueBright(member.id)}]`);
	}
}

export async function restoreUserRoles(member: GuildMember) {
	const { guild } = member,
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

		// Making sure bot doesn't add roles the user already have
		const rolesToAdd = roleIDArray.filter(r => !member.roles.cache.has(r!.id));

		if (!rolesToAdd.length) {
			return {
				success: false,
				roles: rolesToAdd,
			};
		}

		if (rolesToAdd.every(r => r!.position > guild.me!.roles.highest.position)) throw new Error("One or more roles are above me in the hierarchy");

		// Add all roles
		// Map roles to ID, because D.js didn't like it otherwise
		await member.roles.add(rolesToAdd.map(r => r!.id));

		return {
			success: true,
			roles: rolesToAdd,
		};
	}
}
