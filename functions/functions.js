const Discord = require("discord.js");
const db = require("quick.db");
const { prefix, prefixes, prefixes2, emoteNames } = require("../config.js");
const Tinder = new db.table("Tinder");
const Emotes = new db.table("Emotes");
const UserNickTable = new db.table("UserNickTable");

// handle mentions
async function handleMentions(message) {
	const memberColor = message.member.displayColor;
	const embed = new Discord.MessageEmbed({
		title: `Hi ${message.author.username}, what's up?`,
		description: `If you need help type ${prefix}help.`,
		color: memberColor,
	});
	if (message.mentions.has(message.client.user) && !message.author.bot) {
		await message.channel.send(embed);
	}
}
// dad bot
async function dadBot(message) {
	for (const item of prefixes) {
		const r = new RegExp(`(^|\\s|$)(?<statement>(?<prefix>${item})\\s*(?<nickname>.*)$)`, "mi");
		if (r.test(message.content) && !message.author.bot) {
			const { nickname } = message.content.match(r).groups;
			if (nickname.length <= 256) {
				await message.channel.send(`Hi, ${nickname}`);
				const { owner } = message.guild;
				if (nickname.length <= 32) {
					const guildMember = message.author;
					UserNickTable.push(`usernicknames.${guildMember.id}`, nickname);
					if (message.author.id !== owner.id) {
						// Avoids setting nickname on Server owners
						await message.member.setNickname(nickname);
					}
				}
			}
			break;
		}
	}
}
// check for special role
function roleCheck(message) {
	const { names } = require("../config.js");
	return !!message.member.roles.cache.find((r) => r.name === names);
}
// Reacts with emote to specified words
async function emoteReact(message) {
	const keywords = message.content.toLowerCase().split(" ");
	keywords.forEach((word) => {
		if (prefixes2.includes(word)) {
			const emojiName = emoteNames[prefixes2.indexOf(word)];
			if (!message.guild.emojis.cache.find((e) => e.name === emojiName)) return console.log("Couldn't react to message. Emote probably doesnt exist on this guild.");
			const emojiArray = message.guild.emojis.cache.find((e) => e.name === emojiName);
			message.react(emojiArray);
		}
	});
}
// Please don't laugh
let i = 0;
async function tiredNadekoReact(message) {
	const words = ["shit", "fuck", "stop", "dont", "kill", "don't", "don`t", "fucking", "shut", "shutup", "shuttup", "trash", "bad", "hate", "stupid", "dumb", "suck", "sucks"];
	// Yes I know
	const botName = await message.client.user.username.toLowerCase().split(" ");
	if (new RegExp(botName.join("|")).test(message.content.toLowerCase()) && new RegExp(words.join("|")).test(message.content.toLowerCase())) {
		i++;
		if (i < 4) {
			await message.react("😢");
		}
		else {
			// reset length
			await message.channel.send("😢");
			i = 0;
		}
	}
}
async function ResetRolls() {
	// Tinder reset
	const likes = Tinder.get("likes");
	Tinder.delete("temporary");
	for (const key of Object.keys(likes)) {
		Tinder.set(`likes.${key}`, 3);
		Tinder.set(`rolls.${key}`, 15);
	}
	console.log("Rolls and likes have been reset | " + Date() + "\n");
}
async function DailyResetTimer() {
	setTimeout(() => {
		ResetRolls();
		DailyResetTimer();
	}, timeToMidnight());
}
function timeToMidnight() {
	const d = new Date();
	return (-d + d.setHours(24, 0, 0, 0));
}
async function EmoteDBStartup(client) {
	console.log("Emote service: checking for new emotes-");
	let index = 0;
	client.guilds.cache.forEach(guild => {
		guild.emojis.cache.forEach(emote => {
			if (!Emotes.has(`${guild.id}.${emote.id}`)) {
				Emotes.set(`${guild.id}.${emote.id}`, { count: 0 }); index++;
			}
		});
	});
	console.log("Emote service: ...done! " + index + " new emotes added!");
}
async function countEmotes(message) {
	// Well I would like to make this better // Edited for animated emojis and only match with id
	// const emotes = Discord.Util.parseEmoji(message.content); // Single emotes only.
	const emotes = message.content.match(/<?(a)?:.+?:\d+>/g);
	if (emotes) {
		const ids = emotes.toString().match(/\d+/g);
		ids.forEach(id => {
			const emote = message.guild.emojis.cache.find(emoji => emoji.id === id);
			if (emote) {
				Emotes.add(`${message.guild.id}.${emote.id}.count`, 1);
			}
		});
	}
}
function msToTime(duration) {
	const milliseconds = parseInt((duration % 1000) / 100);
	let seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return "**" + hours + "** hours **" + minutes + "** minutes **" + seconds + "." + milliseconds + "** seconds";
}
async function CommandUsage(message, command) {
	// Moved from index - Can be used in commands for more args[1++]
	let reply = `You didn't provide any arguments, ${message.author}!`;

	if (command.usage) {
		reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
	}
	return message.channel.send(reply);
}

module.exports = {
	emoteReact, roleCheck, handleMentions, dadBot, UserNickTable, tiredNadekoReact,
	ResetRolls, DailyResetTimer, EmoteDBStartup, countEmotes, msToTime, timeToMidnight, CommandUsage,
};
