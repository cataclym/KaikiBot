// Fuck this
// 5/8/2020 DDMMYYYY
const { timeToMidnight } = require("./functions"),
	RoleNameJoin = "Join Anniversary",
	RoleNameCreated = "Cake Day",
	d = new Date(),
	Month = d.getMonth(),
	Day = d.getDate(),
	ListUserJoinedAt = [],
	ListUserCreatedAt = [];

async function ReAssignBirthdays(client) {
	console.log("Birthday-Role service: Checking dates-");
	client.guilds.cache.forEach(guild => {
		GuildCheckRolesExist(guild);
		if (guild.me.hasPermission("MANAGE_ROLES")) {
			guild.members.cache.forEach(member => {
				MemberCheckAnniversary(guild, member);
			});
		}
	});
	console.log(`Cake Day:${ListUserJoinedAt.length ? " Users added: " + ListUserJoinedAt.join(", ") : " No users were added to Join Anniversary."}
Join Anniversary:${ListUserCreatedAt.length ? " Users added: " + ListUserCreatedAt.join(", ") : " No users were added to Cake Day."}
Birthday-Role service: Finished checking dates.`);
	setTimeout(() => {
		ReAssignBirthdays(client);
	}, timeToMidnight());
}

async function GuildOnAddBirthdays(guild) {
	console.log("Birthday-Role service: Checking dates-");
	GuildCheckRolesExist(guild);
	if (guild.me.hasPermission("MANAGE_ROLES") || guild.me.hasPermission("ADMINISTRATOR")) {
		guild.members.cache.forEach(member => {
			MemberCheckAnniversary(guild, member);
		});
	}
	console.log(`Cake Day:${ListUserJoinedAt.length ? " Users added: " + ListUserJoinedAt.join(", ") : " No users were added to Join Anniversary."}
Join Anniversary:${ListUserCreatedAt.length ? " Users added: " + ListUserCreatedAt.join(", ") : " No users were added to Cake Day."}
Birthday-Role service: Finished checking dates.`);
}

function GuildCheckRolesExist(guild) {
	if (!guild.me.hasPermission("MANAGE_ROLES")) {
		return console.log(guild.name + " can't add anniversary roles due to missing permissions: 'MANAGE_ROLES'");
	}
	if (!guild.roles.cache.some(r => r.name === RoleNameJoin)) {
		guild.roles.create({
			data: { name: RoleNameJoin },
			reason: "Role didn't exist yet",
		}).catch(err => {
			console.log(err);
		});
	}
	if (!guild.roles.cache.some(r => r.name === RoleNameCreated)) {
		guild.roles.create({
			data: { name: RoleNameCreated },
			reason: "Role didn't exist yet",
		}).catch(err => {
			console.log(err);
		});
	}
}
// Checks all roles
// Add role when date is right
// Removes role when date isn't right
// Its a cluster fuck
// Fixed ? I think so 19/08/2020

function MemberCheckAnniversary(guild, member) {
	const AnniversaryRoleC = guild.roles.cache.find(r => r.name === RoleNameCreated);
	const AnniversaryRoleJ = guild.roles.cache.find(r => r.name === RoleNameJoin);
	if (member.user.createdAt.getMonth() === Month && !member.roles.cache.has(AnniversaryRoleC.id)) {
		if ([Day, Day - 1, Day + 1].includes(member.user.createdAt.getDate())) {
			member.roles.add(AnniversaryRoleC);
			ListUserJoinedAt.push(member.user.tag);
		}
	}
	else if (member.roles.cache.has(AnniversaryRoleC.id)) {
		member.roles.remove(AnniversaryRoleC).catch(err => {
			console.log(err);
		});
	}
	if (member.joinedAt.getMonth() === Month && !member.roles.cache.has(AnniversaryRoleJ.id)) {
		if ([Day, Day - 1, Day + 1].includes(member.joinedAt.getDate())) {
			member.roles.add(AnniversaryRoleJ);
			return ListUserCreatedAt.push(member.user.tag);
		}
	}
	else if (member.roles.cache.has(AnniversaryRoleJ.id)) {
		member.roles.remove(AnniversaryRoleJ).catch(err => {
			console.log(err);
		});
	}
}

module.exports = {
	ReAssignBirthdays, GuildOnAddBirthdays: GuildOnAddBirthdays,
};
