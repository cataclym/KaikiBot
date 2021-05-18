import { Client, Guild, GuildMember, Permissions, Role } from "discord.js";
import logger from "loglevel";
import { AnniversaryStrings } from "../struct/constants";
import { getGuildDB } from "../struct/db";
import { guildsDB } from "../struct/models";

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

	const enabledGuilds = await getEnabledGuilds(client);
	logger.info(`birthdayService | Checking [${enabledGuilds.length}] guilds`);
	await handleAnniversaryGuilds(enabledGuilds, await DateObject());
	return resetArrays();
}

async function checkBirthdayOnAdd(guild: Guild): Promise<void> {

	const enabled = (await getGuildDB(guild.id)).settings.anniversary,
		{ Day, Month } = await DateObject();

	logger.info(`birthdayService | Checking newly added guild ${guild.name} [${guild.id}]`);

	if (enabled) {
		try {
			if (guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
				const [AnniversaryRoleC, AnniversaryRoleJ] = <Role[]> await handleGuildRoles(guild);
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
			logger.info(`birthdayService | Finished checking ${guild.name} [${guild.id}] - Anniversary enabled`);
		}
	}
	else {
		logger.info(`birthdayService | Finished checking ${guild.name} [${guild.id}] - Anniversary disabled`);
	}
}

async function checkAnniversaryMember(member: GuildMember): Promise<void> {
	const { guild } = member,
		enabled = (await getGuildDB(guild.id)).settings.anniversary;

	if (enabled) {
		const { Day, Month } = await DateObject();

		try {
			if (guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
				const [AnniversaryRoleC, AnniversaryRoleJ] = <Role[]> await handleGuildRoles(guild);
				// Get roles from the result of checking if guild has the roles at all / after creating them.
				if (!member.user.bot) {
					// Don't assign special roles to bots.
					MemberCheckAnniversary(member, AnniversaryRoleC, AnniversaryRoleJ, Day, Month);
				}
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

async function handleGuildRoles(guild: Guild): Promise<Role[] | unknown[]> {
	if (!guild.roles.cache.some(r => r.name === AnniversaryStrings.roleNameJoin)) {
		guild.roles.create({
			name: AnniversaryStrings.roleNameJoin,
			reason: "Role didn't exist yet",
		}).catch(err => logger.error(err));
	}
	if (!guild.roles.cache.some(r => r.name === AnniversaryStrings.roleNameCreated)) {
		guild.roles.create({
			name: AnniversaryStrings.roleNameCreated,
			reason: "Role didn't exist yet",
		}).catch(err => logger.error(err));
	}
	const AnniversaryRoleJ = guild.roles.cache.find(r => r.name === AnniversaryStrings.roleNameJoin);
	const AnniversaryRoleC = guild.roles.cache.find(r => r.name === AnniversaryStrings.roleNameCreated);

	return [AnniversaryRoleC, AnniversaryRoleJ];

}

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

async function getEnabledGuilds(client: Client) {

	const dbRes = await guildsDB.find({ "settings.anniversary": true });
	return dbRes.map(s => client.guilds.cache.get(s.id)).filter(Boolean) as Guild[];
}

async function handleAnniversaryGuilds(enabledGuilds: Guild[], { Day, Month }: {Day: number, Month: number}) {

	await Promise.all(enabledGuilds.map(async (guild) => {
		// Check if guild is enabled.
		if (guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
			// Check if perms.
			const [AnniversaryRoleC, AnniversaryRoleJ] = <Role[]> await handleGuildRoles(guild);
			// Get roles from the result of checking if guild has the roles at all / after creating them.
			await Promise.all(guild.members.cache.map(async (member) => {
				if (!member.user.bot) {
					// Don't assign special roles to bots.
					MemberCheckAnniversary(member, AnniversaryRoleC, AnniversaryRoleJ, Day, Month);
				}
			}));
		}
	}));
}

async function resetArrays() {
	listUserJoinedAt = [],
	listUsersCakeDay = [];
}

// Checks all roles
// Add role when date is right
// Removes role when date isn't right
// Its a cluster fuck
// Fixed ? I think so 19/08/2020
// OFC NOT.
// REWRITE AS OF 15/09/2020
//
// 17/05/2021
// It doesnt filter out enabled vs disabled guilds in the Database

export { birthdayService, checkBirthdayOnAdd, checkAnniversaryMember };

