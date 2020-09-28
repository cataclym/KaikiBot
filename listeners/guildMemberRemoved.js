const { Listener } = require("discord-akairo");
const { GuildMember } = require("discord.js");
const db = require("quick.db");
const leaveRoleTable = new db.table("leaveRoleTable");

module.exports = class GuildMemberRemovedListener extends Listener {
	constructor() {
		super("guildMemberRemove", {
			event: "guildMemberRemove",
			emitter: "client",
		});
	}
	async exec(member = GuildMember) {
		leaveRoleTable.set(`${member.guild.id}.${member.id}`, member.roles.cache.map(role => role.id));
	}
};