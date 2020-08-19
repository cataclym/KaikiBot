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
			.setTitle(member.user.tag)
			.addFields(
				{ name: "ID", value: member.user.id, inline: true },
				{ name: "Account date/Join date", value: member.user.createdAt.toDateString() + "\n" + member.joinedAt.toDateString(), inline: true },
				{ name: "Presence", value: member.user?.presence?.activities?.length ? member.user?.presence?.activities : "N/A", inline: true },
				{ name: "Last seen", value: member?.lastMessage?.createdAt?.toDateString(), inline: true },
				{ name: "Boosting?", value: member?.user?.premiumSince?.toDateString(), inline: true },
				{ name: "WIP", value: "More to come", inline: true },
			);
		message.channel.send(embed);
	},
};