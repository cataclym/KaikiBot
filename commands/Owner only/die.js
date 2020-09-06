const { MessageEmbed } = require("discord.js");
const { Command } = require("discord-akairo");

module.exports = class KillBotProcess extends Command {
	constructor() {
		super("die", {
			name: "die",
			aliases: ["die", "kill", "shutdown"],
			description: "Turn bot off, then turn it back on.",
			ownerOnly: true,
		});
	}
	async exec(message) {
		const color = message.member.displayColor;
		const embed = new MessageEmbed({
			author: { icon_url: message.client.user.displayAvatarURL({ dynamic: true }), name: "Dying" },
			fields: { name: "Shutting down", value: "See you later", inline: false },
			color,
		});
		await message.channel.send(embed);
		await console.log("Shutting down");
		await process.exit(1);
	}
};
