const Discord = require("discord.js");
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

module.exports = {
	name: "fetch",
	args: false,
	aliases: ["fu"],
	description: "Fetches a discord user, shows relevant information",
	cmdCategory: "Utility",
	async execute(message, args) {
		let userObject;
		if (!args[0]) { userObject = message.author; }
		else {
			userObject = await message.client.users.fetch(args[0], false, true).catch(() => {
				return undefined;
			});
			if (!userObject) return message.reply("Can't find that user! Try to use ID or @ mention");
		}
		const userFlags = userObject.flags ? userObject.flags.toArray() : [];
		const color = message.member.displayColor;
		const embed = new Discord.MessageEmbed()
			.setColor(color)
			.setDescription(userObject.username)
			.setThumbnail(userObject?.displayAvatarURL({ dynamic: true }))
			.setTitle(userObject.tag)
			.addFields([
				{ name: "ID", value: userObject.id, inline: true },
				{ name: "Account date/Join date", value: userObject?.createdAt?.toDateString(), inline: true },
				{ name: "Presence", value: (userObject?.presence?.activities?.length ? userObject?.presence?.activities.join(", ") : "") + "\n" + (userObject?.presence?.clientStatus ? Object.entries(userObject?.presence?.clientStatus).join(", ") : userObject.presence.status !== "offline" ? "Online" : "Offline"), inline: true },
				{ name: "Flags", value: userFlags.length ? userFlags.map(flag => flags[flag]).join(", ") : "None", inline: true }],
			);
		userObject.bot ? embed.addField("Bot", "✅", true) : null;
		message.channel.send(embed).catch(err => {
			console.log(err);
		});
	},
};