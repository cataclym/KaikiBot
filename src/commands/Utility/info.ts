import { Argument, Command } from "@cataclym/discord-akairo";
import { Channel, Emoji, GuildMember, Message, MessageEmbed, NewsChannel, Role, StageChannel, StoreChannel, TextChannel, VoiceChannel } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { flags } from "../../lib/Util";

export default class InfoCommand extends Command {
	constructor() {
		super("info", {
			aliases: ["info"],
			channel: "guild",
			description: { description: "Returns info on a channel, role, member, emoji, or message",
				usage: ["#channel", "@member", "@role", ":coolCustomEmoji:", "<message ID>" ] },
			args: [
				{
					id: "obj",
					type: Argument.union("member", "channel", "role", "emoji", "guildMessage"),
					otherwise: (m: Message) => noArgGeneric(m),
				},
			],
		});
	}

	public async exec(message: Message, { obj }: { obj: Channel | GuildMember | Role | Emoji | Message }): Promise<Message | void> {

		if (!obj.id) throw new Error("ID is null");

		const emb = new MessageEmbed()
			.withOkColor(message);

		if (obj instanceof Channel) {
			if (obj instanceof VoiceChannel || obj instanceof StageChannel) {
				emb.setTitle(`Info for ${obj.name}`)
					.addField("ID", obj.id, true)
					.addField("Userlimit", obj.userLimit === 0
						? "No limit"
						: obj.userLimit, true)
					.addField("Created at", obj.createdAt, true)
					.addField("Bitrate", obj.bitrate / 1000 + "kbps", true);

				if (obj.parent) emb.addField("Parent", obj.parent.name, true);

				return message.channel.send(emb);
			}

			else if (obj instanceof TextChannel || obj instanceof NewsChannel || obj instanceof StoreChannel) {
				emb.setTitle(`Info for ${obj.name}`)
					.addField("ID", obj.id, true)
					.addField("NSFW", obj.nsfw, true)
					.addField("Created at", obj.createdAt, true);

				if (obj.parent) emb.addField("Parent", obj.parent.name, true);

				return message.channel.send(emb);
			}

			else {
				throw new Error("Channel is undefined");
			}
		}
		else if (obj instanceof GuildMember) {
			// TODO: Add presence / rewrite presence
			emb.setTitle(`Info for ${obj.user.tag}`)
				.setDescription(obj.displayName)
				.setThumbnail(obj.user.displayAvatarURL({ dynamic: true }))
				.addField("ID", obj.id, true)
				.addField("Joined Server", obj.joinedAt, true)
				.addField("Joined Discord", obj.user.createdAt, true)
				.addField("Roles", obj.roles.cache.size, true)
				.addField("Highest role", obj.roles.highest, true);

			if (obj.user.bot) emb.addField("Bot", "✅", true);
			if (obj.user.flags) {
				emb.addField("Flags", obj.user.flags.toArray()
					.map(flag => flags[flag]).join("\n"));
			}

			return message.channel.send(emb);
		}
		else if (obj instanceof Role) {
			emb.setTitle(`Info for ${obj.name}`)
				.addField("ID", obj.id, true)
				.addField("Created at", obj.createdAt, true)
				.addField("Color", obj.hexColor, true)
				.addField("Members", obj.members.size, true)
				.addField("Mentionable", obj.mentionable, true)
				.addField("Hoisted", obj.hoist, true)
				.addField("Position", obj.position, true);

			return message.channel.send(emb);
		}
		else if (obj instanceof Emoji) {
			emb.setTitle(`Info for ${obj.name} ${obj}`)
				.addField("ID", obj.id, true)
				.addField("Name", obj.name, true)
				.addField("Created at", obj.createdAt, true)
				.addField("Animated", obj.animated, true);

			if (obj.url) {
				emb.setImage(obj.url)
					.addField("Link", obj.url, true);
			}

			return message.channel.send(emb);
		}
		else {
			emb.setTitle(`Info for message in ${(obj.channel as TextChannel).name}`)
				.addField("ID", obj.id, true)
				.addField("Created at", obj.createdAt, true)
				.addField("Author", obj.author.tag, true)
				.addField("Link", obj.url, true);

			return message.channel.send(emb);
		}
	}
}