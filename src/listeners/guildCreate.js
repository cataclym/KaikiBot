const { Listener } = require("discord-akairo");
const { TinderStartup, EmoteDBStartup, GuildOnAddBirthdays } = require("../functions/functions");

module.exports = class GuildCreate extends Listener {
	constructor() {
		super("guildCreate", {
			event: "guildCreate",
			emitter: "client",
		});
	}

	async exec(guild) {
		console.log("\nBot was added to " + guild.name + "!! " + guild.memberCount + " members!\n");
		await TinderStartup(guild);
		await EmoteDBStartup(this.client);
		await GuildOnAddBirthdays(guild);
	}
};

