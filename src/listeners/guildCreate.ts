import { Listener } from "discord-akairo";
import { Guild } from "discord.js";
import { checkBirthdayOnAdd } from "../lib/AnniversaryRoles";
import { emoteDataBaseService } from "../lib/functions";
import logger from "loglevel";

module.exports = class GuildCreate extends Listener {
	constructor() {
		super("guildCreate", {
			event: "guildCreate",
			emitter: "client",
		});
	}

	public async exec(guild: Guild) {
		logger.info(`\nBot was added to ${guild.name}!! ${guild.memberCount} members!\n`);
		await emoteDataBaseService(guild);
		await checkBirthdayOnAdd(guild);
	}
};

