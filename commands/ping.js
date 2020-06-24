const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "ping",
	description: "Ping!",
	execute(message) {
		const color = message.member.displayColor;
		const time = Math.round(message.client.ws.ping);
		const embed = new MessageEmbed({
			"title": `Ping took ${time} ms`,
			color
		});
		message.channel.send(embed);
	},
};