import { Listener } from "discord-akairo";
import { Guild } from "discord.js";
import { EmoteDBStartup } from "../functions/functions";
import { TinderStartup } from "../functions/tinder";
import { GuildOnAddBirthdays } from "../functions/AnniversaryRoles";

module.exports = class GuildCreate extends Listener {
	constructor() {
		super("guildCreate", {
			event: "guildCreate",
			emitter: "client",
		});
	}

	async exec(guild: Guild) {
		console.log("\nBot was added to " + guild.name + "!! " + guild.memberCount + " members!\n");
		await TinderStartup(guild);
		await EmoteDBStartup(this.client);
		await GuildOnAddBirthdays(guild);
	}
};

