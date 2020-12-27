import { Listener } from "@cataclym/discord-akairo";
import { GuildMember } from "discord.js";
import db from "quick.db";
const leaveRoleTable = new db.table("leaveRoleTable");

export default class GuildMemberRemovedListener extends Listener {
	constructor() {
		super("guildMemberRemove", {
			event: "guildMemberRemove",
			emitter: "client",
		});
	}
	public async exec(member: GuildMember): Promise<void> {
		leaveRoleTable.set(`${member.guild.id}.${member.id}`, member.roles.cache.map(role => role.id));
	}
}