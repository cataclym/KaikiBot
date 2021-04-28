import { AkairoClient } from "@cataclym/discord-akairo";
import { Guild, Message, MessageEmbed, User } from "discord.js";
import logger from "loglevel";
import { illegalWordCache, keyWordCache } from "../cache/cache";
import { clearRollCache } from "../commands/Tinder/tinder";
import { config } from "../config";
import { badWords } from "../struct/constants";
import { getGuildDB } from "../struct/db";
import { tinderDataDB } from "../struct/models";
import { trim } from "./Util";

let botOwner: User | undefined;

// Reacts with emote to specified words
export async function emoteReact(message: Message): Promise<void> {

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

export async function tiredNadekoReact(message: Message): Promise<void> {

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

export async function ResetRolls(): Promise<void> {
	// Tinder reset
	clearRollCache();
	tinderDataDB.updateMany({ rolls: { $lt: 15 } }, { rolls: 15, temporary: [], likes: 3 }, null, () => {
		logger.info(`mongooseDB | Reset tinder rolls/likes at ${Date()}`);
	});
}

export async function dailyResetTimer(): Promise<void> {
	setTimeout(async () => {
		ResetRolls();
		dailyResetTimer();
	}, timeToMidnight());
}

export function timeToMidnight(): number {
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

export async function emoteDataBaseService(input: AkairoClient | Guild): Promise<number> {
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

export async function countEmotes(message: Message): Promise<void> {
	if (message.guild) {
		const { guild } = message,
			emotes = message.content.match(/<?(a)?:.+?:\d+>/g);
		if (emotes) {
			const db = await getGuildDB(guild.id);
			const ids = emotes.toString().match(/\d+/g);
			ids?.forEach(async id => {
				const emote = guild.emojis.cache.get(id);
				if (emote) {
					db.emojiStats[emote.id]
						? db.emojiStats[emote.id]++
						: db.emojiStats[emote.id] = 1;
					db.markModified(`emojiStats.${emote.id}`);
				}
			});
			db.save();
		}
	}
}

export function msToTime(duration: number): string {
	const milliseconds: number = Math.floor((duration % 1000) / 100);
	let seconds: number | string = Math.floor((duration / 1000) % 60),
		minutes: number | string = Math.floor((duration / (1000 * 60)) % 60),
		hours: number | string = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return "**" + hours + "** hours **" + minutes + "** minutes **" + seconds + "." + milliseconds + "** seconds";
}

export async function illegalWordService(msg: Message): Promise<{
    channel: null;
    word: null;
} | undefined> {
	const gID = msg.guild!.id,
		wordObj = illegalWordCache[gID];

	if (wordObj) {

		if (wordObj.channel !== msg.channel.id || !wordObj?.word) {
			return;
		}

		else if (msg.content.toLowerCase().includes(wordObj.word.toLowerCase())) {
			msg.delete();
		}
	}

	else {

		const otherWordObj = (await getGuildDB(gID)).illegalWordChannel;

		if (!otherWordObj?.channel === undefined) {
			illegalWordCache[gID] = { channel: null, word: null };
		}

		else {
			illegalWordCache[gID] = otherWordObj;
			msg.delete;
		}
	}
}

export async function sendDM(message: Message): Promise<Message | undefined> {
	if (message.author.id === config.ownerID) return;
	// I wont wanna see my own msgs, thank u

	else if (!botOwner) botOwner = this.client.users.cache.get(config.ownerID);

	let attachmentLinks = "";
	logger.info(`message | DM from ${message.author.tag} [${message.author.id}]`);

	const embed = new MessageEmbed({
		author: { name: `${message.author.tag} [${message.author.id}]` },
		description: trim(message.content, 2048),
	})
		.withOkColor();

	// Attachments (Terrible, I know)
	const { attachments } = message;

	if (attachments.first()?.url) {

		const urls: string[] = attachments.map(a => a.url);

		const restLinks = [...urls];
		restLinks.shift();
		attachmentLinks = restLinks.join("\n");

		const firstAttachment = attachments.first()?.url as string;

		embed
			.setImage(firstAttachment)
			.setTitle(firstAttachment)
			.setFooter(urls.join("\n"));
	}

	return botOwner?.send({ content: attachmentLinks ?? null, embed: embed });

}

