const { MessageEmbed } = require("discord.js");
const { ParseMemberObject } = require("../functions/functions");

module.exports = {
	name: "uinfo",
	cooldown: 5,
	aliases: ["user"],
	description: "Shows relevant user info",
	args: false,
	usage: "\u200B",
	cmdCategory: "WIP (Useless)",
	execute(message, args) {
		let member;
		if (!args[0]) { member = message.member; }
		else { ParseMemberObject(message, args) ? member = ParseMemberObject(message, args) : member = message.member; }
		const color = member.displayColor;
		const embed = new MessageEmbed()
			.setColor(color)
			.setDescription(member.displayName)
			.setThumbnail(member.user.displayAvatarURL())
			.setTitle(member.user.username + "#" + member.user.discriminator)
			.addFields(
				{ name: "Account date/Join date", value: member.user.createdAt + "\n" + member.joinedAt, inline: true },
				{ name: "Presence", value: member.presence.length ? member.presence.activities : "N/A", inline: true },
				{ name: "WIP", value: "More to come", inline: true },
			);
		message.channel.send(embed);
	},
};