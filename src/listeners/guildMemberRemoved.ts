import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore;
const leaveRoleTable = new db.table("leaveRoleTable");

module.exports = class GuildMemberRemovedListener extends Listener {
	constructor() {
		super("guildMemberRemove", {
			event: "guildMemberRemove",
			emitter: "client",
		});
	}
	async exec(member: GuildMember) {
		leaveRoleTable.set(`${member.guild.id}.${member.id}`, member.roles.cache.map(role => role.id));
	}
};