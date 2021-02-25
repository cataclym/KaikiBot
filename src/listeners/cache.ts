import { Guild, GuildMember, Message, MessageEmbed, TextChannel } from "discord.js";
import { TGreetMessage } from "../interfaces/db";
import { getGuildDB } from "../struct/db";

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
	console.log(greetLeaveCache);

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
	console.log(greetLeaveCache);

	if (guildSettings.goodbye.enabled) {
		return sendGreetLeaveMessage(guildSettings.goodbye, guildMember.guild, guildMember);
	}
	return undefined;
}

async function sendGreetLeaveMessage(data: TGreetMessage, guild: Guild, guildMember: GuildMember) {

	const channel = guild.channels.cache.get(data.channel) ?? await guild.client.channels.fetch(data.channel, true);
	if (channel.type !== "text") return undefined;

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

async function parsePlaceHolders(input:string, guild: Guild, guildMember: GuildMember) {

	const searchString = input.toLowerCase();

	if (searchString.includes("%guild%")) {
		input = input.replace(/%guild%/ig, guild.name);
	}
	if (searchString.includes("%member%")) {
		input = input.replace(/%member%/ig, guildMember.user.tag);
	}
	return input;
}