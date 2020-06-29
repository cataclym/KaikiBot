const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "ping",
	args: false,
	description: "Ping!",
	aliases: "p",
	usage: "\u200B",
	execute(message) {
		const color = message.member.displayColor;
		const time = Math.abs(message.client.ws.ping);
		const embed = new MessageEmbed({
			title: `Ping took ${time} ms`,
			color,
		});
		message.channel.send(embed);
	},
};
