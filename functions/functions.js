/* eslint-disable global-require */
const Discord = require("discord.js");
const db = require("quick.db");
const { prefix, prefixes, prefixes2, emotenames } = require("../config.js");
const Tinder = new db.table("Tinder");
const Emotes = new db.table("Emotes");

// eslint-disable-next-line new-cap
const UserNickTable = new db.table("UserNickTable");

// handle mentions
async function handleMentions(message) {
	const Mcolor = await message.member.displayColor;
	const embed = new Discord.MessageEmbed({
		title: `Hi ${message.author.username}, what's up?`,
		description: `If you need help type ${prefix}help.`,
		color: Mcolor,
	});
	if (message.mentions.has(message.client.user) && !message.author.bot) {
		message.channel.send(embed);
		
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
async function emotereact(message) {
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
// Please don't laugh
let i = 0;
async function TiredNadeko(message) {
	const words = ["shit", "fuck", "stop", "dont", "kill", "don't", "don`t", "fucking", "shut", "up", "shutup"]; // Yes I know
	const botname = await message.client.user.username.toLowerCase().split(" ");
	try {
		if(new RegExp(botname.join("|")).test(message.content.toLowerCase()) && new RegExp(words.join("|")).test(message.content.toLowerCase())) {
			i++;
			if (i < 4) {
				await message.react("😢");
			}
			else {
				await message.channel.send("😢");
				i = 0; //reset length
			}
		}
	}
	catch (error) {
		console.log(error);
	}		
}
function getUserFromMention(mention, message) {
	if (!mention) return;

	if (mention.startsWith("<@") && mention.endsWith(">")) {
		mention = mention.slice(2, -1);

		if (mention.startsWith("!")) {
			mention = mention.slice(1);
		}
		return message.client.users.cache.get(mention);
	}
}
function ResetRolls() { // Tinder reset
	const likes = Tinder.get("likes");
	for (const key of Object.keys(likes)) {
		Tinder.set(`likes.${key}`, 3);
		Tinder.set(`rolls.${key}`, 10);
	}
	console.log("Rolls and likes have been reset | " + Date() + "\n");
}
function DailyResetTimer() {
	const nd = new Date();
	console.log("Checking for reset at " + nd + "\nResets in " + timeToMidnight() + " milliseconds"); 
	setTimeout(() => {
		ResetRolls();
		DailyResetTimer();
	}, timeToMidnight());
}
function timeToMidnight(){
	var d = new Date();
	return (-d + d.setHours(24,0,0,0));
}
function EmoteDBStartup(message) {
	console.log("Emote service: checking for new emotes-");
	message.guild.emojis.cache.forEach(emote => {
		if(!Emotes.has(`${message.guild.id}.${emote.name}`)) {
			Emotes.set(`${message.guild.id}.${emote.name}`, { count: 0 });
		}
	});
	console.log("Emote service: ...done!");
}
function countEmotes(message) {
	const emotes = message.content.match(/<:.+?:\d+>/g);
	if (emotes) {
		const ids = emotes.toString().match(/\w+/g);
		for (const [i, value] of ids.entries()) {
			const emote = message.guild.emojis.cache.find(emote => emote.name === value);
			if (emote) {
				Emotes.add(`${message.guild.id}.${emote.name}.count`, 1);
			}
		}
	}
}

module.exports = {
	emotereact, rolecheck, handleMentions, dadbot, UserNickTable, TiredNadeko, getUserFromMention, ResetRolls, DailyResetTimer, EmoteDBStartup, countEmotes
};
