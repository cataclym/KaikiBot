import { Snowflake } from "discord-api-types";
import { Guild, GuildMember, Message, MessageEmbed, TextChannel } from "discord.js";
import { parsePlaceHolders } from "./functions";
import { getGuildDocument } from "../struct/documentMethods";
import { EmbedFromJson, IGreet } from "../interfaces/IGreetLeave";
import messageInvalidListener from "../listeners/messageInvalid";

export async function handleGreetMessage(guildMember: GuildMember): Promise<Message | undefined> {

	const db = await getGuildDocument(guildMember.guild.id);

	if (db.settings.welcome.enabled) {
		return sendWelcomeLeaveMessage(db.settings.welcome, guildMember);
	}
	return undefined;
}

export async function handleGoodbyeMessage(guildMember: GuildMember): Promise<Message | undefined> {

	const db = await getGuildDocument(guildMember.guild.id);

	if (db.settings.goodbye.enabled) {
		return sendWelcomeLeaveMessage(db.settings.goodbye, guildMember);
	}
	return undefined;
}

export async function sendWelcomeLeaveMessage(data: IGreet, guildMember: GuildMember): Promise<Message | undefined> {

	if (!data.channel) return;

	const channel = guildMember.guild.channels.cache.get(data.channel as Snowflake)
		?? await guildMember.guild.client.channels.fetch(data.channel as Snowflake, { cache: true });

	if (channel && channel?.type !== "text" && channel?.type !== "news") return;

	if (data.embed && data.channel) {

		const objectIndex: { [index: string]: any } = {};

		for (const [embedKey, embedValue] of Object.entries(data.embed)) {
			if (typeof embedValue === "string") {
				objectIndex[embedKey] = await parsePlaceHolders(embedValue, guildMember);
			}
			else if (embedValue) {
				objectIndex[embedKey] = embedValue;
			}
		}

		return Promise.resolve((channel as TextChannel).send(await new EmbedFromJson(objectIndex)
			.createEmbed()));
	}
}
