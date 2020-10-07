const { Listener } = require("discord-akairo");
const { TinderDBService } = require("../functions/tinder");

module.exports = class GuildCreate extends Listener {
	constructor() {
		super("guildMemberAdd", {
			event: "guildMemberAdd",
			emitter: "client",
		});
	}

	async exec(member) {
		await TinderDBService(member.user);
	}
};

