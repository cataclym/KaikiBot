import { Listener } from "@cataclym/discord-akairo";

export default class GuildCreate extends Listener {
	constructor() {
		super("guildMemberAdd", {
			event: "guildMemberAdd",
			emitter: "client",
		});
	}
}

