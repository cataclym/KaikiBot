const { Listener } = require("discord-akairo");

module.exports = class errorListener extends Listener {
	constructor() {
		super("error", {
			event: "error",
			emitter: "commandHandler",
		});
	}

	async exec(error, message, command) {
		console.log(`🔴 Error: ${message.guild.name} | ${message.channel.name} | ${message.author.username} executed ${command?.id}
        \n🔴 ${error}`);
	}
};

