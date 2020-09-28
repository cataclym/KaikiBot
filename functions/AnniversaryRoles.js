"use strict";
const db = require("quick.db");
const guildConfig = new db.table("guildConfig");
// Fuck this-
// 5/8/2020 DDMMYYYY
const { timeToMidnight } = require("./functions"),
	RoleNameJoin = "Join Anniversary",
	RoleNameCreated = "Cake Day";
async function DateObject() {
	const d = new Date();
	const Month = d.getMonth();
	const Day = d.getDate();
	return { Month, Day };
}
let ListUserCreatedAt = [],
	ListUserJoinedAt = [];

async function ReAssignBirthdays(client) {
	const enabledGuilds = guildConfig.get("anniversary");
	console.time("Anniversary roles");
	console.log("🟩 Birthday-Role service: Checking dates-");
	const { Day, Month } = await DateObject();
	await Promise.all(await client.guilds.cache.map(async (guild) => {
		if (enabledGuilds.includes(guild.id)) {
			if (guild.me.hasPermission("MANAGE_ROLES")) {
				const { AnniversaryRoleC, AnniversaryRoleJ } = await GuildCheckRolesExist(guild);
				await Promise.all(await guild.members.cache.map(async (member) => {
					MemberCheckAnniversary(member, AnniversaryRoleC, AnniversaryRoleJ, Day, Month);
				}));
			}
		}
	}));
	await Promise.all(ListUserCreatedAt, ListUserJoinedAt);
	console.timeEnd("Anniversary roles");

	// What a long line
	console.log(`🟩 Cake Day:${ListUserCreatedAt.length ? " Users added: " + ListUserCreatedAt.join(", ") : " No users were added to Cake Day."}\n🟩 Join Anniversary:${ListUserJoinedAt.length ? " Users added: " + ListUserJoinedAt.join(", ") : " No users were added to Join Anniversary."}\n🟩 Birthday-Role service: Finished checking dates.`);
	ListUserJoinedAt = [],
	ListUserCreatedAt = [];
	setTimeout(async () => {
		ReAssignBirthdays(client);
	}, timeToMidnight());
}

async function GuildOnAddBirthdays(guild) {
	const enabledGuilds = guildConfig.get("anniversary");
	console.log("🟩 Birthday-Role service: Checking new user!");
	const { Day, Month } = await DateObject();
	if (enabledGuilds.includes(guild.id)) {
		if (guild.me.hasPermission("MANAGE_ROLES")) {
			const { AnniversaryRoleC, AnniversaryRoleJ } = await GuildCheckRolesExist(guild);
			guild.members.cache.forEach(async (member) => {
				MemberCheckAnniversary(member, AnniversaryRoleC, AnniversaryRoleJ, Day, Month);
			});
		}
	}
}

async function GuildCheckRolesExist(guild) {
	if (!guild.me.hasPermission("MANAGE_ROLES")) {
		return console.log(guild.name + " can't add anniversary roles due to missing permissions: 'MANAGE_ROLES'");
	}
	if (!guild.roles.cache.some(r => r.name === RoleNameJoin)) {
		guild.roles.create({
			data: { name: RoleNameJoin },
			reason: "Role didn't exist yet",
		}).catch(err => console.log(err));
	}
	if (!guild.roles.cache.some(r => r.name === RoleNameCreated)) {
		guild.roles.create({
			data: { name: RoleNameCreated },
			reason: "Role didn't exist yet",
		}).catch(err => console.log(err));
	}
	const AnniversaryRoleJ = guild.roles.cache.find((r => r.name === RoleNameJoin));
	const AnniversaryRoleC = guild.roles.cache.find((r => r.name === RoleNameCreated));

	return { AnniversaryRoleC, AnniversaryRoleJ };
}
// Checks all roles
// Add role when date is right
// Removes role when date isn't right
// Its a cluster fuck
// Fixed ? I think so 19/08/2020
// OFC NOT.
// REWRITE AS OF 15/09/2020

async function MemberCheckAnniversary(member, AnniversaryRoleC, AnniversaryRoleJ, Day, Month) {
	if (member.user.createdAt.getMonth() === DateObject().Month) {
		if ([Day, Day - 1, Day + 1].includes(member.user.createdAt.getDate())) {
			ListUserCreatedAt.push(member.user.tag);
			if (!member.roles.cache.has(AnniversaryRoleC.id)) {
				member.roles.add(AnniversaryRoleC);
			}
		}
	}
	if (member.joinedAt.getMonth() === Month) {
		if ([Day, Day - 1, Day + 1].includes(member.joinedAt.getDate())) {
			ListUserJoinedAt.push(member.user.tag);
			if (!member.roles.cache.has(AnniversaryRoleJ.id)) {
				return member.roles.add(AnniversaryRoleJ);
			}
		}
	}
	if (!ListUserCreatedAt.includes(member.user.tag)) {
		if (member.roles.cache.has(AnniversaryRoleC.id)) {
			member.roles.remove(AnniversaryRoleC.id, AnniversaryRoleJ.id).catch(err => console.log(err));
		}
		if (member.roles.cache.has(AnniversaryRoleJ.id)) {
			member.roles.remove(AnniversaryRoleJ.id);
		}
	}
}

module.exports = {
	ReAssignBirthdays, GuildOnAddBirthdays,
};
