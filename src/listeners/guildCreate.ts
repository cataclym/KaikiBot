import { Listener } from "@cataclym/discord-akairo";
import { Guild } from "discord.js";
import { emoteDataBaseService } from "../nsb/functions";
import { tinderStartupService } from "../nsb/Tinder";
import { GuildOnAddBirthdays } from "../nsb/AnniversaryRoles";

module.exports = class GuildCreate extends Listener {
	constructor() {
		super("guildCreate", {
			event: "guildCreate",
			emitter: "client",
		});
	}

	public async exec(guild: Guild) {
		console.log("\nBot was added to " + guild.name + "!! " + guild.memberCount + " members!\n");
		await tinderStartupService(guild);
		await emoteDataBaseService(guild);
		await GuildOnAddBirthdays(guild);
	}
};

