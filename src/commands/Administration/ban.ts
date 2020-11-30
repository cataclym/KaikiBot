import { Command } from "discord-akairo";
import { Guild, MessageEmbed, User, Message, GuildMember } from "discord.js";
import { errorColor, getMemberColorAsync } from "../../util/Util";

export default class BanCommand extends Command {
	constructor() {
		super("ban", {
			aliases: ["ban", "bean", "b"],
			userPermissions: ["BAN_MEMBERS"],
			clientPermissions: "BAN_MEMBERS",
			description: { description: "Bans a user by ID or name with an optional message.", usage: "<@some Guy> Your behaviour is harmful." },
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
					match: "restContent",
					default: "banned",
				},
			],
		});
	}
	public async exec(message: Message, { user, reason }: { user: User, reason: string}): Promise<Message> {

		const guild = message.guild as Guild;
		const guildClientMember = guild.me as GuildMember;

		const successBan = new MessageEmbed({
			title: "Banned user",
			color: await getMemberColorAsync(message),
			fields: [
				{ name: "Username", value: user.username, inline: true },
				{ name: "ID", value: user.id, inline: true },
			],
		});

		// If user is currently in the guild
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

		// x2
		else if (guildClientMember.roles.highest.position < guildMember.roles.highest.position) {
			return message.channel.send(new MessageEmbed({
				color: errorColor,
				description: "Sorry, I don't have permissions to ban this member.",
			}));
		}

		await message.guild?.members.ban(user, { reason: reason }).then(m => {
			if (m instanceof User || m instanceof GuildMember) {
				try {
					m.send(new MessageEmbed({
						color: errorColor,
						description: `You have been banned from ${message.guild?.name}.\nReason: ${reason}`,
					}));
				}
				catch {
				// ignored
				}
			}
		});

		return message.channel.send(successBan);
	}
}