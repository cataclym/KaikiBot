import { AkairoClient } from "@cataclym/discord-akairo";
import { Snowflake } from "discord-api-types";
import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import logger from "loglevel";
import { clearRollCache } from "../commands/Tinder/tinder";
import { badWords } from "../struct/constants";
import { getGuildDocument } from "../struct/db";
import { tinderDataModel } from "../struct/models";
import { birthdayService } from "./AnniversaryRoles";
import { trim } from "./Util";

let botOwner: User | undefined;

// Reacts with emote to specified words
export async function emoteReact(message: Message): Promise<void> {

	const wordObj = (await getGuildDocument((message.guild as Guild).id)).emojiReactions;
	const regexFromArray = new RegExp(Object.keys(wordObj).join("|"), "gi");
	const matches = message.content.toLowerCase().match(regexFromArray) || [];

	for (let i = 0; i < matches.length; i++) {
		if (!message.guild!.emojis.cache.has(wordObj[matches[i]] as Snowflake)) return;

		// Using const aSingleEmoji here throws an error, so I'm using the ID instead after checking it exists.
		message.react(wordObj[matches[i]]);
	}
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
	tinderDataModel.updateMany({ rolls: { $lt: 15 } }, { rolls: 15, temporary: [], likes: 3 }, null, () => {
		logger.info(`mongooseDB | Reset tinder rolls/likes at ${Date()}`);
	});
}

export async function dailyResetTimer(client: Client): Promise<void> {
	setTimeout(async () => {
		ResetRolls();
		dailyResetTimer(client);
		birthdayService(client);
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

export async function sendDM(message: Message): Promise<Message | undefined> {
	if (message.author.id === process.env.OWNER) return;
	// I wont wanna see my own msgs, thank u

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

export async function parsePlaceHolders(input:string, guild: Guild, guildMember: GuildMember): Promise<string> {

	const searchString = input.toLowerCase();

	if (searchString.includes("%guild%")) {
		input = input.replace(/%guild%/ig, guild.name);
	}
	if (searchString.includes("%member%")) {
		input = input.replace(/%member%/ig, guildMember.user.tag);
	}
	return input;
}

// /**
//  * Get the sortest form of "I am something" in a message to fuck users over.
//  * Twice as hard when they don't pay attention to what they're saying!
//  * Utilizes a couple loops in order to grab the absolute shortest possible
//  * occurrence of a user saying they are something.
//  * Maximum dadbot!
//  *
//  * @param	{String} userinputisgay		The message the user sent.
//  * @return	{String} The shortest form of the user saying they are something, or null.
//  */
// export function findshortest(userinputisgay: string): null | string {
// 	let longest: string | string[] | null = null;
// 	for (const split in dadbotArray) {
// 		const results = userinputisgay.split(split);
// 		logger.info(results);
// 		if (results.length > 1) {
// 			// split always returns 1 item if it didn't split
// 			results.forEach(r => {
// 				if (longest) {
// 					logger.info(r);
// 					if (r.length < longest.length) {
// 						logger.info(r);
// 						longest = r;
// 					}
// 				}
// 			});
// 		}
// 	}
// 	return longest;
// }
