import { Argument, Command } from "@cataclym/discord-akairo";
import { Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";

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
					type: Argument.union("member", "user", async (_, phrase) => {
						const u = await this.client.users.fetch(phrase);
						return u || null;
					}),
					otherwise: (m: Message) => new MessageEmbed({
						description: "Can't find this user.",
					})
						.withErrorColor(m),
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
	public async exec(message: Message, { user, reason }: { user: GuildMember | User, reason: string}): Promise<Message> {

		const guild = message.guild as Guild,
			guildClientMember = guild.me as GuildMember;

		const successBan = new MessageEmbed({
			title: "Banned user",
			fields: [
				{ name: "Username", value: user instanceof GuildMember
					? user.user.username
					: user.username, inline: true },
				{ name: "ID", value: user.id, inline: true },
			],
		})
			.withOkColor(message);

		// If user is currently in the guild
		const guildMember = message.guild?.members.cache.get(user.id);

		if (!guildMember) {
			await message.guild?.members.ban(user, { reason: reason });
			return message.channel.send(successBan);
		}

		// Check if member is bannable
		if (message.author.id !== message.guild?.ownerID &&
			(message.member as GuildMember).roles.highest.position <= guildMember.roles.highest.position) {

			return message.channel.send(new MessageEmbed({
				description: `${message.author}, You can't use this command on users with a role higher or equal to yours in the role hierarchy.`,
			})
				.withErrorColor(message));
		}

		// x2
		else if (guildClientMember.roles.highest.position <= guildMember.roles.highest.position) {
			return message.channel.send(new MessageEmbed({
				description: "Sorry, I don't have permissions to ban this member.",
			})
				.withErrorColor(message));
		}

		await message.guild?.members.ban(user, { reason: reason }).then(m => {
			try {
				(m as GuildMember | User).send(new MessageEmbed({
					description: `You have been banned from ${message.guild?.name}.\nReason: ${reason}`,
				})
					.withOkColor(message));
			}
			catch {
				// ignored
			}
		})
			.catch((err) => console.log(err));

		return message.channel.send(successBan);
	}
}