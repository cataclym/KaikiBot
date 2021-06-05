import { Snowflake } from "discord-api-types";
import { Guild, GuildMember, Message, MessageEmbed, TextChannel } from "discord.js";
import { TGreetMessage } from "../interfaces/db";
import { parsePlaceHolders } from "../lib/functions";
import { getGuildDocument } from "../struct/db";

export async function handleGreetMessage(guildMember: GuildMember): Promise<Message | undefined> {

	const db = await getGuildDocument(guildMember.guild.id);

	if (db.settings.welcome.enabled) {
		return sendGreetLeaveMessage(db.settings.welcome, guildMember.guild, guildMember);
	}
	return undefined;
}

export async function handleGoodbyeMessage(guildMember: GuildMember): Promise<Message | undefined> {

	const db = await getGuildDocument(guildMember.guild.id);

	if (db.settings.goodbye.enabled) {
		return sendGreetLeaveMessage(db.settings.goodbye, guildMember.guild, guildMember);
	}
	return undefined;
}

async function sendGreetLeaveMessage(data: TGreetMessage, guild: Guild, guildMember: GuildMember) {

	const channel = guild.channels.cache.get(data.channel as Snowflake) ?? await guild.client.channels.fetch(data.channel as Snowflake, true);
	if (channel && channel?.type !== "text" && channel?.type !== "news") return undefined;

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