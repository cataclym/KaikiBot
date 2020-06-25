/* eslint-disable global-require */
const Discord = require("discord.js");
const db = require("quick.db");
const { prefix, prefixes, prefixes2, emotenames } = require("../config.js");

// eslint-disable-next-line new-cap
const UserNickTable = new db.table("UserNickTable");

// handle mentions
function handleMentions(message) {
	const color = message.member.displayColor;
	const embed = new Discord.MessageEmbed({
		title: `Hi ${message.author.username}, what is up?`,
		description: `If you need help type ${prefix}help.`,
		color,
	});
	if (message.mentions.has(message.client.user) && !message.author.bot) {
		message.channel.startTyping()
			.then(message.channel.send(embed))
			.then(message.channel.stopTyping(true));
	}
}
// dadbot
function dadbot(message) {
	// eslint-disable-next-line no-restricted-syntax
	for (const item of prefixes) {
		const r = new RegExp(`(^|\\s|$)(?<statement>(?<prefix>${item})\\s*(?<nickname>.*)$)`, "mi");
		if (r.test(message.content) && !message.author.bot) {
			const { nickname } = message.content.match(r).groups;
			if (nickname.length <= 256) {
				message.channel.send(`Hi, ${nickname}`);
				const { owner } = message.guild;
				if (nickname.length <= 32) {
					const guildmemb = message.author;
					UserNickTable.push(`usernicknames.${guildmemb.id}`, nickname);
					if (message.author.id !== owner.id) { // Avoids setting nickname on Server owners
						message.member.setNickname(nickname).catch((error) => {
							if (error.code) {
								console.error("Failed to set nick due to:", error);
								message.channel.send(`Failed to set nick due to: ${error}`, error);
							}
						});
					}
				}
			}
			break;
		}
	}
}
// check for special role
function rolecheck(message) {
	const { names } = require("../config.js");
	if (message.member.roles.cache.find((r) => r.name === names.toString())) {
		// console.log("Role checked:", specialString.name); //For debug.
		return true;
	}
	return false;
}
// Reacts with emote to specified words
function emotereact(message) {
	const keywords = message.content.toLowerCase().split(" ");
	// eslint-disable-next-line consistent-return
	keywords.forEach((word) => {
		if (prefixes2.includes(word)) {
			const emojiname = emotenames[prefixes2.indexOf(word)];
			if (!message.guild.emojis.cache.find((e) => e.name === emojiname)) return console.log("Couldnt react to message. Emote probably doesnt exist on this guild.");
			const emojiArray = message.guild.emojis.cache.find((e) => e.name === emojiname);
			message.react(emojiArray);
		}
	});
}
module.exports = {
	emotereact, rolecheck, handleMentions, dadbot, UserNickTable,
};
