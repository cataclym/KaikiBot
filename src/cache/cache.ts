import { Guild, GuildMember, Message, MessageEmbed, TextChannel } from "discord.js";
import { TGreetMessage } from "../interfaces/db";
import { parsePlaceHolders } from "../lib/functions";
import { getCommandStatsDB, getGuildDB } from "../struct/db";

export const greetLeaveCache: {
	[guildID: string]: {
		welcome: TGreetMessage,
		goodbye: TGreetMessage,
	}
} = {};

export async function handleGreetMessage(guildMember: GuildMember): Promise<Message | undefined> {
	let guildSettings = greetLeaveCache[guildMember.guild.id];

	if (!(guildMember.guild.id in greetLeaveCache)) {
		guildSettings = await getGuildDB(guildMember.guild.id)
			.then(db => {
				return {
					welcome: db.settings.welcome,
					goodbye: db.settings.goodbye,
				};
			});
		greetLeaveCache[guildMember.guild.id] = guildSettings;
	}

	if (guildSettings.welcome.enabled) {
		return sendGreetLeaveMessage(guildSettings.welcome, guildMember.guild, guildMember);
	}
	return undefined;
}

export async function handleGoodbyeMessage(guildMember: GuildMember): Promise<Message | undefined> {
	let guildSettings = greetLeaveCache[guildMember.guild.id];

	if (!(guildMember.guild.id in greetLeaveCache)) {
		guildSettings = await getGuildDB(guildMember.guild.id)
			.then(db => {
				return {
					welcome: db.settings.welcome,
					goodbye: db.settings.goodbye,
				};
			});
		greetLeaveCache[guildMember.guild.id] = guildSettings;
	}

	if (guildSettings.goodbye.enabled) {
		return sendGreetLeaveMessage(guildSettings.goodbye, guildMember.guild, guildMember);
	}
	return undefined;
}

async function sendGreetLeaveMessage(data: TGreetMessage, guild: Guild, guildMember: GuildMember) {

	const channel = guild.channels.cache.get(data.channel) ?? await guild.client.channels.fetch(data.channel, true);
	if (channel?.type !== "text") return undefined;

	if (data.embed) {
		const embed = new MessageEmbed()
			.setColor(data.color)
			.setDescription(await parsePlaceHolders(data.message, guild, guildMember));

		if (data.image) {
			embed.setImage(data.image);
		}
		return (channel as TextChannel).send(embed);
	}

	else {
		return (channel as TextChannel).send(await parsePlaceHolders(data.message, guild, guildMember));
	}
}

export let cmdStatsCache: {[index: string]: number} = {};

setInterval(async () => {
	const db = await getCommandStatsDB();

	if (!Object.entries(cmdStatsCache).length) return;

	Object.entries(cmdStatsCache)
		.forEach(async ([id, number]) => {
			db.count[id]
				? db.count[id] += number
				: db.count[id] = number;
		});
	db.markModified("count");
	db.save();

	cmdStatsCache = {};
}, 900000);

type cacheObjects = "dadbotCache"
	| "errorColorCache"
	| "okColorCache";

interface sessionCache {
	dadbotCache: {[key: string]: boolean},
	errorColorCache: {[key: string]: string},
	okColorCache: {[key: string]: string},
}

export const sessionCache: sessionCache = {
	dadbotCache: {},
	errorColorCache: {},
	okColorCache: {},
};

export async function setSessionCache(cache: cacheObjects, id: string, value: boolean | string): Promise<string | boolean> {

	return (sessionCache[cache])[id] = value;
}

interface wordCache {[word: string]: number}

interface channelWordCache {[channelID: string]: wordCache}

export const wordCache: channelWordCache = {};

export const keyWordCache: {[guild: string]: {[keyWord: string]: string } } = {};

export const blockedModulesCache: {[guild: string]: {[categoryID: string]: boolean }} = {};

export const illegalWordCache: {[guild: string]:{ channel: string | null, word: string | null }} = {};

// Anime quotes
export type respType = { anime: string, character: string, quote: string };
export const animeQuoteCache: {[character: string]: respType } = {};