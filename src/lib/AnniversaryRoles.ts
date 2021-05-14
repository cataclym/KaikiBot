import { Client, Guild, GuildMember, Role } from "discord.js";
import logger from "loglevel";
import { getGuildDB } from "../struct/db";
import { timeToMidnight } from "./functions";

const roleNameJoin = "Join Anniversary",
	roleNameCreated = "Cake Day";

async function DateObject() {
	const d = new Date();
	const Month = d.getMonth();
	const Day = d.getDate();
	return { Month, Day };
}
let listUsersCakeDay: string[] = [],
	listUserJoinedAt: string[] = [];
// Fuck this-
// 5/8/2020 DDMMYYYY

async function birthdayService(client: Client): Promise<void> {

	const enabledGuilds = client.guilds.cache.array().filter(async (g) => {
			return (await getGuildDB(g.id)).settings.anniversary ? true : false;
		}),
		{ Day, Month } = await DateObject();

	logger.info(`birthdayService | Checking [${enabledGuilds.length}] guilds`);

	await Promise.all(enabledGuilds.map(async (guild) => {
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
			return logger.warn(`birthdayService | ${guild.name} [${guild.id}] - can't add anniversary roles due to missing permissions: 'MANAGE_ROLES'`);
		}
	}));

	await Promise.all([listUsersCakeDay, listUserJoinedAt]);
	listUserJoinedAt = [],
	listUsersCakeDay = [];

	setTimeout(async () => {
		birthdayService(client);
	}, timeToMidnight());
}

async function checkBirthdayOnAdd(guild: Guild): Promise<void> {

	const enabled = (await getGuildDB(guild.id)).settings.anniversary,
		{ Day, Month } = await DateObject();

	logger.info(`birthdayService | Checking newly added guild ${guild.name} [${guild.id}]`);

	if (enabled) {
		try {
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
				return logger.warn(`birthdayService | ${guild.name} [${guild.id}] - can't add anniversary roles due to missing permissions: 'MANAGE_ROLES'`);
			}
		}
		catch (err) {
			logger.error(err);
		}
		finally {
			logger.info(`birthdayService | Finished checking [${guild.id}] - Anniversary enabled`);
		}
	}
	else {
		logger.info(`birthdayService | Finished checking [${guild.id}] - Anniversary disabled`);
	}
}

async function memberOnAddBirthdayService(member: GuildMember): Promise<void> {

	const { guild } = member,
		{ Day, Month } = await DateObject(),
		enabled = (await getGuildDB(guild.id)).settings.anniversary;

	if (enabled) {
		try {
			if (guild.me?.hasPermission("MANAGE_ROLES")) {
				const [AnniversaryRoleC, AnniversaryRoleJ] = <Role[]> await GuildCheckRolesExist(guild);
				// Get roles from the result of checking if guild has the roles at all / after creating them.
				if (!member.user.bot) {
					// Don't assign special roles to bots.
					MemberCheckAnniversary(member, AnniversaryRoleC, AnniversaryRoleJ, Day, Month);
				}
			}
			else {
				return logger.warn(`birthdayService | ${guild.name} [${guild.id}] - can't add anniversary roles due to missing permissions: 'MANAGE_ROLES'`);
			}
		}
		catch (err) {
			logger.error(err);
		}
		finally {
			logger.info(`birthdayService | Checked user ${member.user.tag} in ${guild.name} [${guild.id}]`);
		}
	}
}

async function GuildCheckRolesExist(guild: Guild): Promise<Role[] | unknown[]> {
	if (!guild.roles.cache.some(r => r.name === roleNameJoin)) {
		guild.roles.create({
			data: { name: roleNameJoin },
			reason: "Role didn't exist yet",
		}).catch(err => logger.error(err));
	}
	if (!guild.roles.cache.some(r => r.name === roleNameCreated)) {
		guild.roles.create({
			data: { name: roleNameCreated },
			reason: "Role didn't exist yet",
		}).catch(err => logger.error(err));
	}
	const AnniversaryRoleJ = guild.roles.cache.find((r => r.name === roleNameJoin));
	const AnniversaryRoleC = guild.roles.cache.find((r => r.name === roleNameCreated));

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
			listUsersCakeDay.push(member.user.tag);
			if (!member.roles.cache.has(AnniversaryRoleC.id)) {
				member.roles.add(AnniversaryRoleC);
			}
		}
	}
	if (member.joinedAt?.getMonth() === Month && member.joinedAt.getFullYear() !== new Date().getFullYear()) {
		if (member.joinedAt.getDate() === Day) {
			listUserJoinedAt.push(member.user.tag);
			if (!member.roles.cache.has(AnniversaryRoleJ.id)) {
				return member.roles.add(AnniversaryRoleJ);
			}
		}
	}
	if (!listUsersCakeDay.includes(member.user.tag)) {
		if (member.roles.cache.has(AnniversaryRoleC.id)) {
			member.roles.remove(AnniversaryRoleC.id, AnniversaryRoleJ.id);
		}
		if (member.roles.cache.has(AnniversaryRoleJ.id)) {
			member.roles.remove(AnniversaryRoleJ.id);
		}
	}
}

export {
    birthdayService, checkBirthdayOnAdd, memberOnAddBirthdayService,
};

