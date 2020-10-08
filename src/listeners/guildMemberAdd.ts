import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import { TinderDBService } from "../functions/tinder";

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

