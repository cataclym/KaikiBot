const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message) {
		let color = message.member.displayColor 
		time = Math.round(message.client.ws.ping)
		const embed = new MessageEmbed({
				"title": `Ping took ${time} ms`,
				"color": color
			  })
            message.channel.send(embed);
	},
};