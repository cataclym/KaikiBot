const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const flags = {
	DISCORD_EMPLOYEE: "Discord Employee 👨‍💼",
	DISCORD_PARTNER: "Discord Partner ❤️",
	BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1) 🐛",
	BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2) 🐛",
	HYPESQUAD_EVENTS: "HypeSquad Events 🎊",
	HOUSE_BRAVERY: "House of Bravery 🏠",
	HOUSE_BRILLIANCE: "House of Brilliance 🏠",
	HOUSE_BALANCE: "House of Balance 🏠",
	EARLY_SUPPORTER: "Early Supporter 👍",
	TEAM_USER: "Team User 🏁",
	SYSTEM: "System ⚙️",
	VERIFIED_BOT: "Verified Bot ☑️",
	VERIFIED_DEVELOPER: "Verified Bot Developer ✅",
};

module.exports = class UserInfoCommand extends Command {
	constructor() {
		super("uinfo", {
			name: "uinfo",
			cooldown: 5000,
			aliases: ["user", "uinfo"],
			description: { description: "Shows relevant user info", usage: "<user>" },
			args: [{
				id: "user",
				type: "member",
				default: (message) => message.member,
			}],

		});
	}
	exec(message, args) {
		const member = args.user;
		const userFlags = member.user.flags ? member.user.flags.toArray() : [], color = member.displayColor,
			embed = new Discord.MessageEmbed()
				.setColor(color)
				.setDescription(member.displayName)
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.setTitle(member.user.tag)
				.addFields([
					{ name: "ID", value: member.user.id, inline: true },
					{
						name: "Account date/Join date",
						value: member.user.createdAt.toDateString() + "\n" + member.joinedAt.toDateString(),
						inline: true,
					},
					{
						name: "Presence",
						value: (member.user?.presence?.activities?.length ? member.user?.presence?.activities.join(", ") : "N/A") + "\n" + (member.user.presence.status !== "offline" ? Object.entries(member.user.presence.clientStatus).join(", ") : "Offline"),
						inline: true,
					},
					{
						name: "Flags",
						value: userFlags.length ? userFlags.map(flag => flags[flag]).join("\n") : "None",
						inline: true,
					},
					{
						name: "Roles (" + member.roles.cache.size + ")",
						value: member.roles.cache.array().sort((a, b) => b.position - a.position || b.id - a.id).slice(0, 10).join("\n"),
						inline: true,
					}],
				);
		member?.premiumSince ? embed.addField("Boosting", "Since " + member.premiumSince.toDateString() + " ✅", true) : null;
		member.user.bot ? embed.addField("Bot", "✅", true) : null;
		message.channel.send(embed).catch(err => {
			console.log(err);
		});
	}
};