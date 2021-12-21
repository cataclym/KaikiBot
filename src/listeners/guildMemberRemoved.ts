import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import { handleGoodbyeMessage } from "../lib/GreetHandler";
import { getGuildDocument } from "../struct/documentMethods";

export default class GuildMemberRemovedListener extends Listener {
	constructor() {
		super("guildMemberRemove", {
			event: "guildMemberRemove",
			emitter: "client",
		});
	}
	public async exec(member: GuildMember): Promise<void> {

		await handleGoodbyeMessage(member);

		const db = await getGuildDocument(member.guild.id);
		db.leaveRoles[member.id] = member.roles.cache.map(role => role.id);
		db.markModified("leaveRoles");
		await db.save();
	}
}
