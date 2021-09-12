import { Argument } from "discord-akairo";
import {
	CategoryChannel,
	Channel,
	Emoji,
	GuildMember,
	Message,
	MessageEmbed,
	NewsChannel,
	Role,
	StageChannel,
	StoreChannel,
	TextChannel,
	ThreadChannel,
	VoiceChannel,
} from "discord.js";
import * as emojis from "node-emoji";
import { errorMessage, noArgGeneric } from "../../lib/Embeds";
import { flags } from "../../lib/Util";
import { EMOTE_REGEX } from "../../struct/constants";
import { KaikiCommand } from "kaiki";


type regexpType = { match: RegExpMatchArray };

export default class InfoCommand extends KaikiCommand {
	constructor() {
		super("info", {
			aliases: ["info"],
			channel: "guild",
			description: "Returns info on a channel, role, member, emoji, or message",
			usage: ["#channel", "@member", "@role", ":coolCustomEmoji:", "messageID" ],
			args: [
				{
					id: "obj",
					type: Argument.union("member", "channel", "role", "emoji", (message, content) => {
						return emojis.find(content);
					}, "guildMessage", EMOTE_REGEX),
					match: "content",
					otherwise: async (m: Message) => ({
						embeds: [await errorMessage(m, "A channel, user, role, emoji or message was not found. Make sure to provide a valid argument!")],
					}),
				},
			],
		});
	}

	public async exec(message: Message, { obj }: { obj: Channel | GuildMember | Role | regexpType | emojis.Emoji | Message }): Promise<Message | void> {

		const emb = new MessageEmbed()
			.withOkColor(message);

		function isRegex(value: { match: RegExpMatchArray } | emojis.Emoji): value is regexpType {
			return (value as regexpType).match !== undefined;
		}

		if (obj instanceof Channel) {

			if (obj instanceof VoiceChannel || obj instanceof StageChannel) {
				emb.setTitle(`Info about voice channel: ${obj.name}`)
					.addField("ID", obj.id)
					.addField("User limit", obj.userLimit === 0
						? "No limit"
						: String(obj.userLimit))
					.addField("Created at", String(obj.createdAt))
					.addField("Bitrate", obj.bitrate / 1000 + "kbps");

				if (obj.parent) emb.addField("Parent", `${obj.parent.name} [${obj.parentId}]`);
			}

			else if (obj instanceof TextChannel || obj instanceof NewsChannel || obj instanceof StoreChannel) {
				emb.setTitle(`Info about text channel: ${obj.name}`)
					.addField("ID", obj.id)
					.addField("NSFW", obj.nsfw ? "Enabled" : "Disabled")
					.addField("Created at", String(obj.createdAt));

				if (obj.parent) emb.addField("Parent", `${obj.parent.name} [${obj.parentId}]`);
			}

			else if (obj instanceof CategoryChannel) {
				emb.setTitle(`Info about category channel: ${obj.name}`)
					.addField("ID", obj.id)
					.addField("Children", String(obj.children.size))
					.addField("Created at", String(obj.createdAt));

				if (obj.parent) emb.addField("Parent", `${obj.parent.name} [${obj.parentId}]`);
			}

			else if (obj instanceof ThreadChannel) {
				emb.setTitle(`Info about Thread: ${obj.name}`)
					.addField("ID", obj.id)
					.addField("Created at", String(obj.createdAt));

				if (obj.ownerId) {
					emb.addField("Author", message.guild?.members.cache.get(obj.ownerId)?.user.username ?? obj.ownerId);
				}

				if (obj.parent) emb.addField("Parent", `${obj.parent.name} [${obj.parentId}]`);
			}
		}

		else if (obj instanceof GuildMember) {
			// TODO: Add presence / rewrite presence
			emb.setTitle(`Info about user: ${obj.user.tag}`)
				.setDescription(obj.displayName)
				.setThumbnail(obj.user.displayAvatarURL({ dynamic: true }))
				.addField("ID", obj.id, true)
				.addField("Joined Server", String(obj.joinedAt ?? "Dunno"), true)
				.addField("Joined Discord", String(obj.user.createdAt), true)
				.addField("Roles", String(obj.roles.cache.size), true)
				.addField("Highest role", String(obj.roles.highest), true);

			const uFlags = obj.user.flags?.toArray();

			if (uFlags?.length) {
				emb.addField("Flags", uFlags.map(flag => flags[flag]).join("\n"), true);
			}

			if (obj.user.bot) emb.addField("Bot", "✅", true);
		}

		else if (obj instanceof Role) {
			emb.setTitle(`Info about role: ${obj.name}`)
				.addField("ID", obj.id, true)
				.addField("Created at", String(obj.createdAt), true)
				.addField("Color", obj.hexColor, true)
				.addField("Members", String(obj.members.size), true)
				.addField("Mentionable", String(obj.mentionable), true)
				.addField("Hoisted", String(obj.hoist), true)
				.addField("Position", String(obj.position), true);
		}

		else if (obj instanceof Emoji) {
			emb.setTitle(`Info about Emoji: ${obj.name} ${obj}`)
				.addField("Name", obj.name ?? "Null", true)
				.addField("ID", obj.id ?? "Null", true)
				.addField("Created at", String(obj.createdAt ?? "Null"), true)
				.addField("Animated", obj.animated ? "Yes" : "No", true);

			if (obj.url) {
				emb.setImage(obj.url)
					.addField("Link", obj.url, true);
			}
		}

		else if (obj instanceof Message) {
			emb.setTitle(`Info about message in channel: ${(obj.channel as TextChannel).name}`)
				.addField("ID", obj.id, true)
				.addField("Created at", String(obj.createdAt), true)
				.addField("Author", obj.author.tag, true)
				.addField("Link", obj.url, true);
		}

		else if (isRegex(obj)) {

			const emoji = obj.match[0].toString().split(":");

			if (emoji.length < 3) return message.channel.send({ embeds: [noArgGeneric(message)] });

			const id = emoji[2].replace(">", "");
			const link = `https://cdn.discordapp.com/emojis/${id}.${emoji[0] === "<a" ? "gif" : "png"}`;

			emb.setTitle("Info about custom emoji")
				.setImage(link)
				.addField("Name", emoji[1], true)
				.addField("ID", id, true)
				// eslint-disable-next-line no-irregular-whitespace
				.addField("Raw", `\`${emoji[0]}:${emoji[1]}:${emoji[2]}\``, true)
				.addField("Link", link, true);
		}

		else {
			emb.setTitle(`Info about default emoji: ${obj.emoji}`)
				.addField("Name", obj.key, true)
				.addField("Raw", obj.emoji, true);
		}

		return message.channel.send({ embeds: [emb] });

	}
}
