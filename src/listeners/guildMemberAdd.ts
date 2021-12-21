import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import { handleGreetMessage } from "../lib/GreetHandler";
import { checkAnniversaryMember } from "../lib/AnniversaryRoles";
import { handleStickyRoles } from "../lib/roles";

export default class GuildMemberAddListener extends Listener {
	constructor() {
		super("guildMemberAdd", {
			event: "guildMemberAdd",
			emitter: "client",
		});
	}
	public async exec(member: GuildMember): Promise<void> {

		await checkAnniversaryMember(member);
		await handleGreetMessage(member);
		await handleStickyRoles(member);
	}
}

