import { Guild } from "discord.js";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { GuildMember } from "discord.js";
import { TGreetMessage } from "../interfaces/db";
import { getGuildDB } from "../struct/db";

export const greetLeaveCache: {
	[guildID: string]: {
		welcome: TGreetMessage,
		goodbye: TGreetMessage,
	}
} = {};

export async function handleGreetMessage(guildMember: GuildMember) {
	let guildSettings = greetLeaveCache[guildMember.guild.id];

	if (!(guildMember.guild.id in greetLeaveCache)) {
		guildSettings = await getGuildDB(guildMember.guild.id)
			.then(db => {
				return {
					welcome: db.settings.welcome,
					goodbye: db.settings.goodbye,
				};
			});
	}

	if (guildSettings.welcome.enabled) {
		return sendGreetLeaveMessage(guildSettings.welcome, guildMember.guild, guildMember);
	}
	return undefined;
}

export async function handleGoodbyeMessage(guildMember: GuildMember) {
	let guildSettings = greetLeaveCache[guildMember.guild.id];

	if (!(guildMember.guild.id in greetLeaveCache)) {
		guildSettings = await getGuildDB(guildMember.guild.id)
			.then(db => {
				return {
					welcome: db.settings.welcome,
					goodbye: db.settings.goodbye,
				};
			});
	}

	if (guildSettings.goodbye.enabled) {
		return sendGreetLeaveMessage(guildSettings.goodbye, guildMember.guild, guildMember);
	}
	return undefined;
}

async function sendGreetLeaveMessage(data: TGreetMessage, guild: Guild, guildMember: GuildMember) {

	if (data.embed) {
		const embed = new MessageEmbed()
			.setColor(data.color)
			.setDescription(data.message);

		if (data.image) {
			embed.setImage(data.image);
		}
		const channel = guild.channels.cache.get(data.channel) ?? await guild.client.channels.fetch(data.channel);
		if (channel.type !== "text") return undefined;
		return (channel as TextChannel).send(embed);
	}

	else {
		const channel = guild.channels.cache.get(data.channel) ?? await guild.client.channels.fetch(data.channel);
		if (channel.type !== "text") return undefined;
		return (channel as TextChannel).send(await parsePlaceHolders(data.message, guild, guildMember));
	}
}

async function parsePlaceHolders(params:string, guild: Guild, guildMember: GuildMember) {
	return params.replace(/%guild%/ig, guild.name).replace(/%member%/ig, guildMember.user.tag);
}