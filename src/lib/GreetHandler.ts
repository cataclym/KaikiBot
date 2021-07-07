import { Snowflake } from "discord-api-types";
import { ColorResolvable, Guild, GuildMember, Message, MessageEmbed, TextChannel } from "discord.js";
import { parsePlaceHolders } from "./functions";
import { getGuildDocument } from "../struct/documentMethods";
import { EmbedJSON, EmbedJSONClass, IGreet } from "../interfaces/IGreetLeave";

export async function handleGreetMessage(guildMember: GuildMember): Promise<Message | undefined> {

	const db = await getGuildDocument(guildMember.guild.id);

	if (db.settings.welcome.enabled) {
		return sendWelcomeLeaveMessage(db.settings.welcome, guildMember.guild, guildMember);
	}
	return undefined;
}

export async function handleGoodbyeMessage(guildMember: GuildMember): Promise<Message | undefined> {

	const db = await getGuildDocument(guildMember.guild.id);

	if (db.settings.goodbye.enabled) {
		return sendWelcomeLeaveMessage(db.settings.goodbye, guildMember.guild, guildMember);
	}
	return undefined;
}

async function sendWelcomeLeaveMessage(data: IGreet, guild: Guild, guildMember: GuildMember) {

	const channel = guild.channels.cache.get(data.channel as Snowflake) ?? await guild.client.channels.fetch(data.channel as Snowflake, { cache: true });
	if (channel && channel?.type !== "text" && channel?.type !== "news") return undefined;

	if (data.embed) {

		const objectIndex: {[index: string]: any} = {};

		for (const [embedKey, embedValue] of Object.entries(data.embed)) {
			if (typeof embedValue === "string") {
				objectIndex[embedKey] = await parsePlaceHolders(embedValue, guildMember);
			}
			else if (embedValue) {
				objectIndex[embedKey] = embedValue;
			}
		}

		const embedData = new EmbedJSONClass(objectIndex);

		const embed = new MessageEmbed()
			.setColor(embedData.color as ColorResolvable || "NOT_QUITE_BLACK");

			if (embedData.description) embed.setDescription(await parsePlaceHolders(embedData.description, guildMember));
			if (embedData.image) embed.setImage(embedData.image);
			if (embedData.author && embedData.author.name) embed.setAuthor(embedData.author.name, embedData.author.icon_url ?? null);
			if (embedData.footer && embedData.footer.text) embed.setFooter(embedData.footer.text, embedData.footer.icon_url ?? null);
			if (embedData.fields && embedData.fields.length) {
				embedData.fields.forEach(field => {
					if (!field.name || !field.value) return;
					embed.addField(field.name, field.value, field.inline ?? false);
				});
			}
		}

		return (channel as TextChannel).send({ content: data.embed.plainText ?? null, embeds: [embed] });
	}
}
