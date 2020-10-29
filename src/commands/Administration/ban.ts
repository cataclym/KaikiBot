import { Command } from "discord-akairo";
import { MessageEmbed, User, Message, GuildMember } from "discord.js";
import { config } from "../../config";
import { errorColor, getMemberColorAsync } from "../../functions/Util";

export default class BanCommand extends Command {
	constructor() {
		super("ban", {
			aliases: ["ban", "bean", "b"],
			userPermissions: ["BAN_MEMBERS"],
			clientPermissions: "BAN_MEMBERS",
			description: { description: "Bans a user by ID or name with an optional message.", usage: config.prefix + "b <@some Guy> Your behaviour is harmful." },
			channel: "guild",
			args: [
				{
					id: "user",
					type: "user",
					otherwise: new MessageEmbed({
						color: errorColor,
						description: "Can't find this user.",
					}),
				},
				{
					id: "reason",
					type: "string",
					match: "content",
					default: "banned",
				},
			],
		});
	}
	async exec(message: Message, { user, reason }: { user: User, reason: string}): Promise<Message> {

		const successBan = new MessageEmbed({
			title: "Banned user",
			color: await getMemberColorAsync(message),
			fields: [
				{ name: "Username", value: user.username, inline: true },
				{ name: "ID", value: user.id, inline: true },
			],
		});

		// If uses is currently in the guild
		const guildMember = message.guild?.members.cache.get(user.id);

		if (!guildMember) {
			await message.guild?.members.ban(user, { reason: reason });
			return message.channel.send(successBan);
		}

		// Check if member is bannable
		if (message.author.id != message.guild?.ownerID && (message.member as GuildMember).roles.highest.comparePositionTo(guildMember.roles.highest) > 0) {
			return message.channel.send(new MessageEmbed({
				color: errorColor,
				description: "You don't have permissions to ban this member.",
			}));
		}

		try {
			await user.send(new MessageEmbed({
				color: errorColor,
				description: `You have been banned from ${message.guild?.name}.\nReason: ${reason}`,
			}));
		}
		catch {
			// ignored
		}

		await message.guild?.members.ban(user, { reason: reason });

		return message.channel.send(successBan);
	}
}