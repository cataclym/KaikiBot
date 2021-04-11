import { AkairoClient } from "@cataclym/discord-akairo";
import { Guild, Message } from "discord.js";
import logger from "loglevel";
import { clearRollCache } from "../commands/Tinder/tinder";
import { badWords } from "../struct/constants";
import { getGuildDB } from "../struct/db";
import { tinderDataDB } from "../struct/models";

export const keyWordCache: {[guild: string]: {[keyWord: string]: string} } = {
};

// Reacts with emote to specified words
async function emoteReact(message: Message): Promise<void> {

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const gID = message.guild!.id;
	let wordObj = keyWordCache[gID];

	if (!wordObj) {
		keyWordCache[gID] = (await getGuildDB(gID)).emojiReactions;
		wordObj = keyWordCache[gID];
	}

	const keywords = message.content.toLowerCase().split(" ");

	keywords.forEach(async (word) => {
		if (wordObj[word]) {
			// TODO: Able to add more words, select random word, store in db
			if (!message.guild?.emojis.cache.has(wordObj[word])) return;

			const aSingleEmoji = message.guild.emojis.cache.find((e) => e.id === wordObj[word]);

			if (!aSingleEmoji) return;

			message.react(aSingleEmoji);
		}
	});
}

async function tiredNadekoReact(message: Message): Promise<void> {

	const botName = message.client.user?.username.toLowerCase().split(" ");

	if (!botName) {
		return;
	}

	if (new RegExp(botName.join("|")).test(message.content.toLowerCase())
		&& new RegExp(badWords.join("|")).test(message.content.toLowerCase())) {

		const index: number = Math.floor(Math.random() * 10);

		if (index < 7) {
			message.react("😢");
		}

		else {
			message.channel.send("😢");
		}
	}
}

async function ResetRolls(): Promise<void> {
	// Tinder reset
	clearRollCache();
	tinderDataDB.updateMany({ rolls: { $lt: 15 } }, { rolls: 15, temporary: [], likes: 3 }, null, () => {
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
