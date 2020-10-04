import { Command } from "discord-akairo";
import { ClientPresenceStatusData } from "discord.js";
import { MessageEmbed, Message } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util";
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

module.exports = class FetchUserCommand extends Command {
	constructor() {
		super("fetch", {
			aliases: ["fu", "fetch"],
			description: { description: "Fetches a discord user, shows relevant information", usage: "<id>" },
		});
	}
	async exec(message: Message) {
		const messageArguments = message.content.slice().split(/ +/);
		const userObject = await message.client.users.fetch(messageArguments[1], false, true).catch(() => { return null; }) || message.author;
		const userFlags = userObject.flags ? userObject.flags.toArray() : [];
		const color = await getMemberColorAsync(message);
		let presenceString = "";
		if (userObject?.presence?.activities?.length || userObject?.presence?.clientStatus) {
			presenceString += userObject?.presence?.activities.join(", ") + "\n" +
            Object.entries(<ClientPresenceStatusData>userObject.presence.clientStatus);
		}
		else if (userObject.presence.status) {
			presenceString += userObject.presence.status;
		}
		const embed = new MessageEmbed()
			.setColor(color)
			.setDescription(userObject.username)
			.setThumbnail(userObject?.displayAvatarURL({ dynamic: true }))
			.setTitle(userObject.tag)
			.addFields([
				{ name: "ID", value: userObject.id, inline: true },
				{ name: "Account date/Join date", value: userObject?.createdAt?.toDateString(), inline: true }],
			);
		message.client.users.cache.has(userObject.id) ? embed.addField("Presence", presenceString, true) : null;
		userFlags.length ? embed.addField("Flags", userFlags.map((flag) => flags[flag]).join(", "), true) : null;
		userObject.bot ? embed.addField("Bot", "✅", true) : null;
		message.channel.send(embed).catch(err => {
			console.log(err);
		});
	}
};