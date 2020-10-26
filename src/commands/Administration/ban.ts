import { Command } from "discord-akairo";
import { MessageEmbed, User, Message, GuildMember } from "discord.js";
import { errorColor, getMemberColorAsync } from "../../functions/Util";

export default class BanCommand extends Command {
	constructor() {
		super("ban", {
			aliases: ["ban", "bean", "b"],
			userPermissions: ["BAN_MEMBERS"],
			clientPermissions: "BAN_MEMBERS",
			channel: "guild",
			args: [
				{
					id: "user",
					type: "user",
				},
				{
					id: "reason",
					type: "string",
					default: null,
				},
			],
		});
	}
	async exec(message: Message, { user, reason }: { user: User, reason: string}): Promise<Message | void | string | User | GuildMember> {

		const guildMember = message.guild?.members.cache.get(user.id);

		if (!guildMember) {
			return message.guild?.members.ban(user, { reason: reason });
		}

		if (message.author.id != message.guild?.ownerID && (message.member as GuildMember).roles.highest.comparePositionTo(guildMember.roles.highest) > 0) {
			return message.channel.send(new MessageEmbed({
				color: await getMemberColorAsync(message),
				description: "You don't have permissions to ban this member.",
			}));
		}

		await message.guild?.members.ban(user, { reason: reason });
		await user.send(new MessageEmbed({
			color: errorColor,
			description: `You have been banned from ${message.guild?.name}.\nReason: ${reason ? reason : "banned"}`,
		}));
		return message.channel.send(new MessageEmbed({
			title: "Banned user",
			color: await getMemberColorAsync(message),
			fields: [
				{ name: "Username", value: guildMember.user.username, inline: true },
				{ name: "ID", value: guildMember.user.id, inline: true },
			],
		}));
	}
}