import { AkairoClient } from "discord-akairo";
import { Snowflake } from "discord-api-types";
import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import logger from "loglevel";
// import { clearRollCache } from "../../_wip/Tinder/tinder";
import { badWords } from "../struct/constants";
import { getBotDocument, getGuildDocument } from "../struct/documentMethods";
import { tinderDataModel } from "../struct/models";
import { birthdayService } from "./AnniversaryRoles";
import { partition, trim } from "./Util";
import { dailyClaimsCache, emoteReactCache, separatedEmoteReactTypes } from "../cache/cache";
import { regexpType } from "../struct/types";

let botOwner: User | undefined;

export async function populateERCache(message: Message) {

	const emoteReacts = Object.entries((await getGuildDocument((message.guild as Guild).id)).emojiReactions);
	if (!emoteReacts.length) {
		emoteReactCache[message.guild!.id] = {
			has_space: {},
			no_space: {},
		};
		return;
	}

	const [array_has_space, array_no_space] = partition(emoteReacts, ([k, v]) => k.includes(" "));

	emoteReactCache[message.guild!.id] = {
		has_space: Object.fromEntries(array_has_space),
		no_space: Object.fromEntries(array_no_space),
	};
}


// Reacts with emote to specified words
export async function emoteReact(message: Message): Promise<void> {

	const gId = message.guild!.id,
		messageContent = message.content.toLowerCase();

	if (!emoteReactCache[gId]) await populateERCache(message);

	const emotes = emoteReactCache[message.guild!.id],
		matches = Object.keys(emotes.has_space)
			.filter(k => messageContent.match(new RegExp(k.toLowerCase(), "g")));

	for (const word of messageContent.split(" ")) {
		if (emotes.no_space[word]) {
			matches.push(word);
		}
	}

	if (!matches.length) return;

	return emoteReactLoop(message, matches, emotes);
}

async function emoteReactLoop(message: Message, matches: RegExpMatchArray, wordObj: separatedEmoteReactTypes) {
	for (const word of matches) {
		const emote = wordObj.no_space[word] || wordObj.has_space[word];
		if (!message.guild?.emojis.cache.has(emote as Snowflake)) continue;
		message.react(emote);
	}
}

export async function tiredKaikiCryReact(message: Message): Promise<void> {

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

export async function resetRolls(): Promise<void> {
	// Tinder reset
	// clearRollCache();
	tinderDataModel.updateMany({ rolls: { $lt: 15 } }, { rolls: 15, temporary: [], likes: 3 }, null, () => {
		logger.info(`mongooseDB | Reset tinder rolls/likes at ${Date()}`);
	});
}

export async function resetDailyClaims(): Promise<void> {
	const db = await getBotDocument();
	if (!db.settings.dailyEnabled) return;
	await Promise.all(Object.keys(dailyClaimsCache).map(async (k) => delete dailyClaimsCache[k]));
	logger.info("resetDailyClaims | Daily claims have been reset!");
}

export async function dailyResetTimer(client: Client): Promise<void> {
	setTimeout(async () => {
		// Loop this
		dailyResetTimer(client);
		// Reset tinder rolls
		// resetRolls();
		// Reset daily currency claims
		resetDailyClaims();
		// Check for "birthdays"
		birthdayService(client);
		// Uh?
		emoteDataBaseService(client as AkairoClient);
	}, timeToMidnight());
}

export function timeToMidnight(): number {
	const d = new Date();
	return (-d + d.setHours(24, 0, 0, 0));
}

async function emoteDB(guild: Guild) {
	let i = 0;
	const db = await getGuildDocument(guild.id);
	for await (const emote of [...guild.emojis.cache.values()]) {
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
			const db = await getGuildDocument(guild.id);
			const ids = emotes.toString().match(/\d+/g);
			ids?.forEach(async id => {
				const emote = guild.emojis.cache.get(id as Snowflake);
				if (emote) {
					db.emojiStats[emote.id]
						? db.emojiStats[emote.id]++
						: db.emojiStats[emote.id] = 1;
					db.markModified(`emojiStats.${emote.id}`);
				}
			});
			await db.save();
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

export async function sendDM(message: Message): Promise<Message | undefined> {
	if (message.author.id === process.env.OWNER) return;
	// I don't wanna see my own msgs, thank u

	if (!botOwner) botOwner = message.client.users.cache.get(process.env.OWNER as Snowflake);

	let attachmentLinks = "";
	logger.info(`message | DM from ${message.author.tag} [${message.author.id}]`);

	const embed = new MessageEmbed({
		author: { name: `${message.author.tag} [${message.author.id}]` },
		description: trim(message.content, 2048),
	})
		.withOkColor();

	// Attachments (Terrible, I know)
	const { attachments } = message;

	if (attachments.first()) {

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

	return botOwner?.send({ content: attachmentLinks ?? null, embeds: [embed] });

}

export async function parsePlaceHolders(input:string, guildMember: GuildMember): Promise<string> {

	if (input.includes("%guild%")) {
		input = input.replace(/%guild%/ig, guildMember.guild.name);
	}
	if (input.includes("%member%")) {
		input = input.replace(/%member%/ig, guildMember.user.tag);
	}
	return input;
}

export function isRegex(value: any): value is regexpType {
	return (value as regexpType).match !== undefined;
}
