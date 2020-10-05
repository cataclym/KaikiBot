import Discord from "discord.js";
import { Util, Message, User, Client } from "discord.js";
import db from "quick.db";
import { prefix, prefixes, prefixes2, emoteNames } from "../config.js";
import { getMemberColorAsync } from "./Util";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Tinder = new db.table("Tinder"), Emotes = new db.table("Emotes"), guildConfig = new db.table("guildConfig"), UserNickTable = new db.table("UserNickTable");
import { names } from "../config";
const words = ["shit", "fuck", "stop", "dont", "kill", "don't", "don`t", "fucking", "shut", "shutup", "shuttup", "trash", "bad", "hate", "stupid", "dumb", "suck", "sucks"];

// handle mentions
async function handleMentions(message: Message) {
	if (message.mentions.has(message.client.user as User, { ignoreDirect: false, ignoreEveryone: true, ignoreRoles: true }) && !message.author.bot) {
		const embed = new Discord.MessageEmbed({
			title: `Hi ${message.author.username}, what's up?`,
			description: `If you need help type ${prefix}help.`,
			color: await getMemberColorAsync(message),
		});
		return message.channel.send(embed);
	}
}
// dad bot
async function dadBot(message: Message) {
	for (const item of prefixes) {
		const r = new RegExp(`(^|\\s|$)(?<statement>(?<prefix>${item})\\s*(?<nickname>.*)$)`, "mi");
		if (r.test(message.content) && !message.author.bot) {
			const { nickname } : any = message.content.match(r)?.groups;
			if (nickname.length <= 256) {
				Util.removeMentions(nickname);
				// Incase of roles being mentionable.
				message.channel.send(`Hi, ${nickname}`);
				const owner = message.guild?.owner;
				if (nickname.length <= 32) {
					const guildMember = message.author;
					UserNickTable.push(`usernicknames.${guildMember.id}`, nickname);
					if (message.author.id !== owner?.id) {
						// Avoids setting nickname on Server owners
						await message.member?.setNickname(nickname);
					}
				}
			}
			break;
		}
	}
}
// check for special role
function roleCheck(message: Message) {
	return !!message.member?.roles.cache.find((r) => r.name === names);
}
// Reacts with emote to specified words
async function emoteReact(message: Message) {
	const keywords = message.content.toLowerCase().split(" ");
	keywords.forEach(async (word) => {
		if (prefixes2.includes(word)) {
			// TODO: Able to add more words, select random word, store in db
			const emojiName = emoteNames[prefixes2.indexOf(word)];
			if (!message.guild?.emojis.cache.find((e) => e.name === emojiName)) return console.log("Couldn't react to message. Emote probably doesnt exist on this guild.");
			const emojiArray = message.guild.emojis.cache.find((e) => e.name === emojiName);
			message.react(emojiArray ? emojiArray : "⚠");
		}
	});
}
// Please don't laugh
let i = 0;
async function tiredNadekoReact(message: Message) {
	// Yes I know
	const botName = message.client.user!.username.toLowerCase().split(" ");
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
async function EmoteDBStartup(client: Client) {
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

const startUp = async () => {
	if (!guildConfig.get("dadbot")) { guildConfig.set("dadbot", ["10000000"]); }
	if (!guildConfig.get("anniversary")) { guildConfig.set("anniversary", ["10000000"]); }
	console.log("🟩 Startup finished.");
};

async function countEmotes(message: Message) {
	const emotes = message.content.match(/<?(a)?:.+?:\d+>/g);
	if (emotes) {
		const ids = emotes.toString().match(/\d+/g);
		ids?.forEach(id => {
			const emote = message.guild?.emojis.cache.find(emoji => emoji.id === id);
			if (emote) {
				Emotes.add(`${message.guild?.id}.${emote.id}.count`, 1);
			}
		});
	}
}
function msToTime(duration: number) {
	const milliseconds: number = Math.floor((duration % 1000) / 100);
	let seconds: number | string = Math.floor((duration / 1000) % 60),
		minutes: number | string = Math.floor((duration / (1000 * 60)) % 60),
		hours: number | string = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return "**" + hours + "** hours **" + minutes + "** minutes **" + seconds + "." + milliseconds + "** seconds";
}

export {
	emoteReact, roleCheck, handleMentions, dadBot, UserNickTable, tiredNadekoReact,
	ResetRolls, DailyResetTimer, EmoteDBStartup, countEmotes, msToTime, timeToMidnight, startUp,
};
