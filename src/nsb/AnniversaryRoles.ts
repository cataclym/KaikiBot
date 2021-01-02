"use strict";
import { Client, Guild, GuildMember, Role } from "discord.js";
import db from "quick.db";
const guildConfig = new db.table("guildConfig");
import { timeToMidnight } from "./functions";
import { logger } from "./Logger";
const RoleNameJoin = "Join Anniversary",
	RoleNameCreated = "Cake Day";

async function DateObject() {
	const d = new Date();
	const Month = d.getMonth();
	const Day = d.getDate();
	return { Month, Day };
}
let ListUserCreatedAt: string[] = [],
	ListUserJoinedAt: string[] = [];
// Fuck this-
// 5/8/2020 DDMMYYYY

async function birthdayService(client: Client): Promise<void> {

	const enabledGuilds = guildConfig.get("anniversary");

	const { Day, Month } = await DateObject();

	await Promise.all(client.guilds.cache.map(async (guild) => {
		if (enabledGuilds.includes(guild.id)) {
			// Check if guild is enabled.
			if (guild.me?.hasPermission("MANAGE_ROLES")) {
				// Check if perms.
				const [AnniversaryRoleC, AnniversaryRoleJ] = <Role[]> await GuildCheckRolesExist(guild);
				// Get roles from the result of checking if guild has the roles at all / after creating them.
				await Promise.all(guild.members.cache.map(async (member) => {
					if (!member.user.bot) {
						// Don't assign special roles to bots.
						MemberCheckAnniversary(member, AnniversaryRoleC, AnniversaryRoleJ, Day, Month);
					}
				}));
			}
			else {
				return logger.medium(`${guild.name} [${guild.id}] | can't add anniversary roles due to missing permissions: 'MANAGE_ROLES'`);
			}
		}
	}));
	await Promise.all([ListUserCreatedAt, ListUserJoinedAt]);

	// What a long line
	logger.info(`Cake Day | ${ListUserCreatedAt.length ? " Users added: " + ListUserCreatedAt.join(", ") : " No users were added to Cake Day."}\nJoin Anniversary | ${ListUserJoinedAt.length ? " Users added: " + ListUserJoinedAt.join(", ") : " No users were added to Join Anniversary."}`);
	logger.low("birthdayService | Finished checking dates!");
	ListUserJoinedAt = [],
	ListUserCreatedAt = [];
	setTimeout(async () => {
		birthdayService(client);
	}, timeToMidnight());
}

async function GuildOnAddBirthdays(guild: Guild): Promise<void> {
	const enabledGuilds = guildConfig.get("anniversary");
	logger.info("birthdayService | Checking new user!");
	const { Day, Month } = await DateObject();
	if (enabledGuilds.includes(guild.id)) {
		if (guild.me?.hasPermission("MANAGE_ROLES")) {
			const [AnniversaryRoleC, AnniversaryRoleJ] = <Role[]> await GuildCheckRolesExist(guild);
			// Get roles from the result of checking if guild has the roles at all / after creating them.
			await Promise.all(guild.members.cache.map(async (member) => {
				if (!member.user.bot) {
					// Don't assign special roles to bots.
					MemberCheckAnniversary(member, AnniversaryRoleC, AnniversaryRoleJ, Day, Month);
				}
			}));
		}
		else {
			return logger.medium(`${guild.name} [${guild.id}] | can't add anniversary roles due to missing permissions: 'MANAGE_ROLES'`);
		}
	}
}

async function GuildCheckRolesExist(guild: Guild): Promise<Role[] | unknown[]> {
	if (!guild.roles.cache.some(r => r.name === RoleNameJoin)) {
		guild.roles.create({
			data: { name: RoleNameJoin },
			reason: "Role didn't exist yet",
		}).catch(err => logger.high(err));
	}
	if (!guild.roles.cache.some(r => r.name === RoleNameCreated)) {
		guild.roles.create({
			data: { name: RoleNameCreated },
			reason: "Role didn't exist yet",
		}).catch(err => logger.high(err));
	}
	const AnniversaryRoleJ = guild.roles.cache.find((r => r.name === RoleNameJoin));
	const AnniversaryRoleC = guild.roles.cache.find((r => r.name === RoleNameCreated));

	return [AnniversaryRoleC, AnniversaryRoleJ];

}
// Checks all roles
// Add role when date is right
// Removes role when date isn't right
// Its a cluster fuck
// Fixed ? I think so 19/08/2020
// OFC NOT.
// REWRITE AS OF 15/09/2020

async function MemberCheckAnniversary(member: GuildMember, AnniversaryRoleC: Role, AnniversaryRoleJ: Role, Day: number, Month: number) {
	if (member.user.createdAt.getMonth() === Month) {
		if (member.user.createdAt.getDate() === Day) {
			ListUserCreatedAt.push(member.user.tag);
			if (!member.roles.cache.has(AnniversaryRoleC.id)) {
				member.roles.add(AnniversaryRoleC);
			}
		}
	}
	if (member.joinedAt?.getMonth() === Month) {
		if (member.joinedAt.getDate() === Day) {
			ListUserJoinedAt.push(member.user.tag);
			if (!member.roles.cache.has(AnniversaryRoleJ.id)) {
				return member.roles.add(AnniversaryRoleJ);
			}
		}
	}
	if (!ListUserCreatedAt.includes(member.user.tag)) {
		if (member.roles.cache.has(AnniversaryRoleC.id)) {
			member.roles.remove(AnniversaryRoleC.id, AnniversaryRoleJ.id);
		}
		if (member.roles.cache.has(AnniversaryRoleJ.id)) {
			member.roles.remove(AnniversaryRoleJ.id);
		}
	}
}

export {
	birthdayService, GuildOnAddBirthdays,
};
