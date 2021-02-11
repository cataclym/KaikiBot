import { Collection, Message, Client, Guild } from "discord.js";
import { getGuildDB } from "../struct/db";
import { config } from "../config";
import { logger } from "./Logger";
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
	tinderDataDB.updateMany({ tinderData: { $type: "object" } }, { $set: { "tinderData.temporary": [], "tinderData.rolls": 15, "tinderData.likes": 3 } }, null, () => {
		logger.info(`mongooseDB | Reset tinder rolls/likes at ${Date()}`);
	});
}

async function dailyResetTimer(): Promise<void> {
	ResetRolls();
	setTimeout(async () => {
		ResetRolls();
		dailyResetTimer();
	}, timeToMidnight());
}

function timeToMidnight(): number {
	const d = new Date();
	return (-d + d.setHours(24, 0, 0, 0));
}

async function emoteDB(guild: Guild, i = 0) {
	const gDB = await getGuildDB(guild.id);
	guild.emojis.cache.forEach(async emote => {

		if (!gDB.emojiStats[emote.id]) {
			gDB.emojiStats[emote.id] = 0;
			i++;
		}
	});
	gDB.save();
	return Promise.resolve(i);
}

async function emoteDataBaseService(input: Client | Guild): Promise<number> {

	if (input instanceof Client) {
		let i = 0;
		input.guilds.cache.forEach(async guild => {
			emoteDB(guild);
			i++;
		});
		return Promise.resolve(i);
	}

	else {
		return emoteDB(input);
	}
}

async function countEmotes(message: Message): Promise<void> {
	const emotes = message.content.match(/<?(a)?:.+?:\d+>/g),
		{ guild } = message;
	if (emotes && guild) {
		const ids = emotes.toString().match(/\d+/g);
		ids?.forEach(async id => {
			const emote = guild.emojis.cache.find(emoji => emoji.id === id);
			if (emote) {
				const db = await getGuildDB(guild.id);
				db.emojiStats[emote.id]
					? db.emojiStats[emote.id]++
					: db.emojiStats[emote.id] = 1;
				db.save();
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

async function dbColumns(client: Client): Promise<Collection<string, Guild>> {
	const guilds = client.guilds.cache.each(g => {
		return getGuildDB(g.id);
	});
	return Promise.resolve(guilds);
}

export {
	countEmotes,
	dailyResetTimer,
	dbColumns,
	emoteDataBaseService,
	emoteReact,
	msToTime,
	ResetRolls,
	timeToMidnight,
	tiredNadekoReact,
};
