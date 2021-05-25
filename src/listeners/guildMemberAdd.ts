import { Listener } from "@cataclym/discord-akairo";
import { GuildMember } from "discord.js";
import { handleGreetMessage } from "../lib/GreetHandler";
import { checkAnniversaryMember } from "../lib/AnniversaryRoles";

export default class GuildMemberAddListener extends Listener {
	constructor() {
		super("guildMemberAdd", {
			event: "guildMemberAdd",
			emitter: "client",
		});
	}
	public async exec(member: GuildMember): Promise<void> {

		checkAnniversaryMember(member);

		handleGreetMessage(member);
	}
}

