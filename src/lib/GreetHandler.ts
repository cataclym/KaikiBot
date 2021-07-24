import { Snowflake } from "discord-api-types";
import { GuildMember, Message, TextChannel } from "discord.js";
import { parsePlaceHolders } from "./functions";
import { getGuildDocument } from "../struct/documentMethods";
import { EmbedFromJson, IGreet, MessageEmbedOptionsJSON } from "../interfaces/IGreetLeave";

export async function handleGreetMessage(guildMember: GuildMember): Promise<Message | void> {

	const db = await getGuildDocument(guildMember.guild.id);

	if (db.settings.welcome.enabled) {
		return sendWelcomeLeaveMessage(db.settings.welcome, guildMember);
	}
	return;
}

export async function handleGoodbyeMessage(guildMember: GuildMember): Promise<Message | void> {

	const db = await getGuildDocument(guildMember.guild.id);

	if (db.settings.goodbye.enabled) {
		return sendWelcomeLeaveMessage(db.settings.goodbye, guildMember);
	}
	return;
}

export async function createAndParseWelcomeLeaveMessage(data: IGreet, guildMember: GuildMember): Promise<MessageEmbedOptionsJSON> {

	const objectIndex: { [index: string]: any } = {};

	for (const [embedKey, embedValue] of Object.entries(data.embed)) {
		if (typeof embedValue === "string") {
			objectIndex[embedKey] = await parsePlaceHolders(embedValue, guildMember);
		}
		else if (embedValue) {
			objectIndex[embedKey] = embedValue;
		}
	}
	return objectIndex;
}

export async function sendWelcomeLeaveMessage(data: IGreet, guildMember: GuildMember): Promise<Message | void> {
	if (!data.channel) return;

	const channel = guildMember.guild.channels.cache.get(data.channel as Snowflake)
			?? await guildMember.guild.client.channels.fetch(data.channel as Snowflake, { cache: true });

	if (channel && channel?.type !== "GUILD_TEXT" && channel?.type !== "GUILD_NEWS") return;

	if (data.embed) {

		const objectIndex = await createAndParseWelcomeLeaveMessage(data, guildMember);

		return (channel as TextChannel).send(await new EmbedFromJson(objectIndex).createEmbed())
			.then((m) => {
				if (data.timeout) {
					setTimeout(() => m.delete(), data.timeout * 1000);
					return m;
				}
				return m;
			});
	}
}

