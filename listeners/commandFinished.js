const { Listener } = require("discord-akairo");

module.exports = class commandFinishedListener extends Listener {
	constructor() {
		super("commandFinished", {
			event: "commandFinished",
			emitter: "commandHandler",
		});
	}

	async exec(message, command) {
		const date = new Date().toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", year: "numeric", month: "numeric", day: "numeric" });
		console.log(`🟢 ${date} | ${message.guild.name} | #${message.channel.name} | ${message.author.username} executed ${command.id}` +
		`\n🔢 GuildID: ${message.guild.id} | ChanID: ${message.channel.id} | UserID: ${message.author.id}`);
	}
};

