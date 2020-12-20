import { Message, Client, Guild } from "discord.js";
import { config } from "../config";
import db from "quick.db";
import { logger } from "./logger";
const Tinder = new db.table("Tinder"), Emotes = new db.table("Emotes"), guildConfig = new db.table("guildConfig"), UserNickTable = new db.table("UserNickTable");
const words = ["shit", "fuck", "stop", "dont", "kill", "don't", "don`t", "fucking", "shut", "shutup", "shuttup", "trash", "bad", "hate", "stupid", "dumb", "suck", "sucks"];

// Reacts with emote to specified words
async function emoteReact(message: Message): Promise<void> {
	const keywords = message.content.toLowerCase().split(" ");
	keywords.forEach(async (word) => {
		if (config.prefixes2.includes(word)) {
			// TODO: Able to add more words, select random word, store in db
			const emojiName = config.emoteNames[config.prefixes2.indexOf(word)];
			if (!message.guild?.emojis.cache.find((e) => e.name === emojiName)) return console.log("Couldn't react to message. Emote probably doesnt exist on this guild.");
			const emojiArray = message.guild.emojis.cache.find((e) => e.name === emojiName);
			message.react(emojiArray ? emojiArray : "⚠");
		}
	});
}

const index = {
	i: 0,
};
// Please don't laugh
async function tiredNadekoReact(message: Message): Promise<void> {
	const botName = message.client.user?.username.toLowerCase().split(" ");
	if (!botName) {
		return;
	}
	if (new RegExp(botName.join("|")).test(message.content.toLowerCase()) && new RegExp(words.join("|")).test(message.content.toLowerCase())) {
		index.i++;
		if (index.i < 4) {
			message.react("😢");
		}
		else {
			// reset length
			message.channel.send("😢");
			index.i = 0;
		}
	}
}

async function ResetRolls(): Promise<void> {
	// Tinder reset
	const likes = Tinder.get("likes");
	Tinder.delete("temporary");
	for (const key of Object.keys(likes)) {
		Tinder.set(`likes.${key}`, 3);
		Tinder.set(`rolls.${key}`, 15);
	}
	logger.info("resetRolls | Rolls and likes have been reset | " + Date() + "\n");
}

async function DailyResetTimer(): Promise<void> {
	setTimeout(async () => {
		ResetRolls();
		DailyResetTimer();
	}, timeToMidnight());
}

function timeToMidnight(): number {
	const d = new Date();
	return (-d + d.setHours(24, 0, 0, 0));
}

async function emoteDataBaseService(input: Client | Guild): Promise<number> {

	let i = 0;
	if (input instanceof Client) {
		input.guilds.cache.forEach(guild => {
			guild.emojis.cache.forEach(emote => {
				if (!Emotes.has(`${guild.id}.${emote.id}`)) {
					Emotes.set(`${guild.id}.${emote.id}`, { count: 0 }); i++;
				}
			});
		});
	}

	else if (input instanceof Guild) {
		input.emojis.cache.forEach(emote => {
			if (!Emotes.has(`${input.id}.${emote.id}`)) {
				Emotes.set(`${input.id}.${emote.id}`, { count: 0 }); i++;
			}
		});
	}
	else {
		throw new Error("emoteDataBaseService | error");
	}
	return i;
}

// Yeah this is stupid.
const startUp = async (): Promise<void> => {
	if (!guildConfig.get("dadbot")) { guildConfig.set("dadbot", ["10000000"]); }
	if (!guildConfig.get("anniversary")) { guildConfig.set("anniversary", ["10000000"]); }
	return Promise.resolve();
};

async function countEmotes(message: Message): Promise<void> {
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

function msToTime(duration: number): string {
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
	emoteReact, UserNickTable, tiredNadekoReact,
	ResetRolls, DailyResetTimer, emoteDataBaseService, countEmotes, msToTime, timeToMidnight, startUp,
};
