import { AkairoClient } from "@cataclym/discord-akairo";
import { Guild, Message } from "discord.js";
import logger from "loglevel";
import { config } from "../config";
import { getGuildDB } from "../struct/db";
import { tinderDataDB } from "../struct/models";


const words = ["shit", "fuck", "stop", "dont", "kill", "don't", "don`t", "fucking", "shut", "shutup", "shuttup", "trash", "bad", "hate", "stupid", "dumb", "suck", "sucks"];
const index: {[name: string]: number} = {
};

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

// Please don't laugh
async function tiredNadekoReact(message: Message): Promise<void> {
	const botName = message.client.user?.username.toLowerCase().split(" ");
	if (!botName) {
		return;
	}
	if (new RegExp(botName.join("|")).test(message.content.toLowerCase()) && new RegExp(words.join("|")).test(message.content.toLowerCase())) {
		index["i"] ? index["i"]++ : index["i"] = 0;
		if (index["i"] < 4) {
			message.react("😢");
		}
		else {
			// reset length
			message.channel.send("😢");
			index["i"] = 0;
		}
	}
}

async function ResetRolls(): Promise<void> {
	// Tinder reset
	tinderDataDB.updateMany({ rolls: { $lt: 15 } }, { $set: { "tinderData.temporary": [], "tinderData.rolls": 15, "tinderData.likes": 3 } }, null, () => {
		logger.info(`mongooseDB | Reset tinder rolls/likes at ${Date()}`);
	});
}

async function dailyResetTimer(): Promise<void> {
	setTimeout(async () => {
		ResetRolls();
		dailyResetTimer();
	}, timeToMidnight());
}

function timeToMidnight(): number {
	const d = new Date();
	return (-d + d.setHours(24, 0, 0, 0));
}

async function emoteDB(guild: Guild) {
	let i = 0;
	const db = await getGuildDB(guild.id);
	for await (const emote of guild.emojis.cache.array()) {
		if (!(emote.id in db.emojiStats)) {
			i++;
			db.emojiStats[emote.id] = 0;
		}
	}
	if (i > 0) db.markModified("emojiStats");
	db.save();
	return i;
}

async function emoteDataBaseService(input: AkairoClient | Guild): Promise<number> {
	// eslint-disable-next-line no-var
	var changes = 0;
	if (input instanceof AkairoClient) {
		await input.guilds.cache.reduce(async (promise, guild) => {
			await promise;
			changes += await emoteDB(guild);
		}, Promise.resolve());
		return changes;
	}
	else {
		return await emoteDB(input);
	}
}

async function countEmotes(message: Message): Promise<void> {
	if (message.guild) {
		const { guild } = message,
			emotes = message.content.match(/<?(a)?:.+?:\d+>/g);
		if (emotes) {
			const ids = emotes.toString().match(/\d+/g);
			ids?.forEach(async id => {
				const emote = guild.emojis.cache.find(emoji => emoji.id === id);
				if (emote) {
					const db = await getGuildDB(guild.id);
					db.emojiStats[emote.id]
						? db.emojiStats[emote.id]++
						: db.emojiStats[emote.id] = 1;
					db.markModified("emojiStats");
					db.save();
				}
			});
		}
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
	countEmotes,
	dailyResetTimer,
	emoteDataBaseService,
	emoteReact,
	msToTime,
	ResetRolls,
	timeToMidnight,
	tiredNadekoReact,
};
