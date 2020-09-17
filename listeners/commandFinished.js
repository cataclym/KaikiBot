const { Listener } = require("discord-akairo");

module.exports = class commandFinishedListener extends Listener {
	constructor() {
		super("commandFinished", {
			event: "commandFinished",
			emitter: "commandHandler",
		});
	}

	async exec(message, command) {
		console.log(`${new Date().toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", year: "numeric", month: "numeric", day: "numeric" })} 🟢 ${message.guild.name} | #${message.channel.name} | ${message.author.username} executed ${command.id}`);
	}
};

