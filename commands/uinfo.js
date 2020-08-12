const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "uinfo",
	cooldown: 5,
	aliases: ["user"],
	description: "Shows relevant user info",
	args: false,
	usage: "\u200B",
	cmdCategory: "WIP (Useless)",
	execute(message) {
		const color = message.member.displayColor;
		const embed = new MessageEmbed()
			.setColor(color)
			.setDescription(message.member.displayName)
			.setThumbnail(message.member.user.displayAvatarURL())
			.setTitle(message.member.user.username + "#" + message.member.user.discriminator)
			.addFields(
				{ name: "Account date/Join date", value: message.member.user.createdAt + "\n" + message.member.joinedAt, inline: true },
				{ name: "Presence", value: message.member.presence.activities, inline: true },
				{ name: "WIP", value: "More to come", inline: true },
			);
		message.channel.send(embed);
	},
};