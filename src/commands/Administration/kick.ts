import { Command } from "discord-akairo";
import { MessageEmbed, User, Message, GuildMember } from "discord.js";
import { errorColor, getMemberColorAsync } from "../../functions/Util";

export default class KickCommand extends Command {
	constructor() {
		super("kick", {
			aliases: ["kick", "k"],
			userPermissions: ["KICK_MEMBERS"],
			clientPermissions: "KICK_MEMBERS",
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
	async exec(message: Message, { user, reason }: { user: User, reason: string}): Promise<Message> {

		const guildMember = message.guild?.members.cache.get(user.id);

		if (!guildMember) {
			return message.channel.send(new MessageEmbed({
				color: errorColor,
				description: "Can't find this user.",
			}));
		}

		if (message.author.id != message.guild?.ownerID && (message.member as GuildMember).roles.highest.comparePositionTo(guildMember.roles.highest) > 0) {
			return message.channel.send(new MessageEmbed({
				color: errorColor,
				description: "You don't have permissions to ban this member.",
			}));
		}

		await guildMember.kick(reason);
		try {
			await user.send(new MessageEmbed({
				color: errorColor,
				description: `You have been kicked from ${message.guild?.name}.\nReason: ${reason ? reason : "kicked"}`,
			}));
		}
		catch {
			// ignored
		}
		return message.channel.send(new MessageEmbed({
			title: "Kicked user",
			color: await getMemberColorAsync(message),
			fields: [
				{ name: "Username", value: guildMember.user.username, inline: true },
				{ name: "ID", value: guildMember.user.id, inline: true },
			],
		}));
	}
}