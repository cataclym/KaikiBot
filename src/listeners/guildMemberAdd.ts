import { Listener } from "@cataclym/discord-akairo";
import { GuildMember } from "discord.js";
import { handleGreetMessage } from "../cache/cache";
import { memberOnAddBirthdayService } from "../nsb/AnniversaryRoles";

export default class GuildMemberAddListener extends Listener {
	constructor() {
		super("guildMemberAdd", {
			event: "guildMemberAdd",
			emitter: "client",
		});
	}
	public async exec(member: GuildMember): Promise<void> {

		memberOnAddBirthdayService(member);

		handleGreetMessage(member);
	}
}

