import { Listener } from "@cataclym/discord-akairo";
import { GuildMember } from "discord.js";
import { TinderDBService } from "../nsb/Tinder";

export default class GuildCreate extends Listener {
	constructor() {
		super("guildMemberAdd", {
			event: "guildMemberAdd",
			emitter: "client",
		});
	}

	public async exec(member: GuildMember): Promise<void> {
		await TinderDBService(member.user);
	}
}

