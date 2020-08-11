////////////////////
// Fuck this
////////////////////
// 5/8/2020 DDMMYYYY

const { timeToMidnight } = require("./functions");

const RoleNameJoin = "Join Anniversary";
const RoleNameCreated = "Cake Day";
const d = new Date();
const Month = d.getMonth();
const Day = d.getDate();
const ListUserJoinedAt = [];
const ListUserCreatedAt = [];

async function ReAssignBirthdays(client)
{
	console.log("Birthday-Role service: Checking dates-");
	client.guilds.cache.forEach(guild => {
		GuildCheckRolesExist(guild);
		if (guild.me.hasPermission("MANAGE_ROLES"))
		{
			guild.members.cache.forEach(member => {
				MemberCheckAnniversaryJ(guild, member);
				MemberCheckAnniversaryC(guild, member);
			});
		}
	});
	console.log("Birthday-Role service: Finished checking dates." + 
	"\nCake Day:" + (ListUserJoinedAt.length ? " Users added: " + ListUserJoinedAt.join(", ") : " No users were added to Cake Day.") +
	"\nJoin Anniversary:" + (ListUserCreatedAt.length ? " Users added: " + ListUserCreatedAt.join(", ") : "No users were added to Join Anniversary."));
	setTimeout(() => {
		ReAssignBirthdays(client);
	}, timeToMidnight());
}

async function GuildOnAddBdays(guild) {
	console.log("Birthday-Role service: Checking dates-");
	GuildCheckRolesExist(guild);
	if (guild.me.hasPermission("MANAGE_ROLES") || guild.me.hasPermission("ADMINISTRATOR"))
	{
		guild.members.cache.forEach(member => {
			MemberCheckAnniversaryJ(guild, member);
			MemberCheckAnniversaryC(guild, member);
		});
	}
	console.log("Birthday-Role service: Finished checking dates." + 
	"\nCake Day:" + (ListUserJoinedAt.length ? " Users added: " + ListUserJoinedAt.join(", ") : "No users were added to Join Anniversary") +
	"\nJoin Anniversary:" + (ListUserCreatedAt.length ? " Users added: " + ListUserCreatedAt.join(", ") : "No users were added to Cake Day."));
}

function GuildCheckRolesExist(guild)
{
	if (!guild.me.hasPermission("MANAGE_ROLES"))
	{
		return console.log(guild.name + " can't add anniversary roles due to missing permissions: 'MANAGE_ROLES'");
	}
	if (!guild.roles.cache.some(r => r.name === RoleNameJoin))
	{
		guild.roles.create({
			data: { name: RoleNameJoin },
			reason: "Role didn't exist yet",
		});
	}
	if (!guild.roles.cache.some(r => r.name === RoleNameCreated))
	{
		guild.roles.create({
			data: { name: RoleNameCreated },
			reason: "Role didn't exist yet",
		});
	}
}
// Checks all roles 
// Add role when date is right
// Removes role when date isnt right 
// Its a clusterfuck

function MemberCheckAnniversaryC(guild, member)
{
	const AnniversaryRoleC = guild.roles.cache.find(r => r.name === RoleNameCreated);
	if (member.user.createdAt.getMonth() === Month && member.user.createdAt.getDate() === (Day || Day-1 || Day+1) && !member.roles.cache.some((r) => r.name === RoleNameCreated))
	{
		member.roles.add(AnniversaryRoleC);
		ListUserJoinedAt.push(`${member.user.username}#${member.user.discriminator}`);
	}
	else
	{
		member.roles.remove(AnniversaryRoleC);
	}
}
function MemberCheckAnniversaryJ(guild, member)
{
	const AnniversaryRoleJ = guild.roles.cache.find(r => r.name === RoleNameJoin);
	if (member.joinedAt.getMonth() === Month && member.joinedAt.getDate() === (Day || Day-1 || Day+1) && !member.roles.cache.some((r) => r.name === RoleNameJoin))
	{
		member.roles.add(AnniversaryRoleJ);
		ListUserCreatedAt.push(`${member.user.username}#${member.user.discriminator}`);
	}
	else
	{
		member.roles.remove(AnniversaryRoleJ);
	}
}

module.exports = {
	ReAssignBirthdays, GuildOnAddBdays
};
