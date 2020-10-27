import { Command } from "discord-akairo";
import { MessageEmbed, Message, GuildMember } from "discord.js";
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
					id: "member",
					type: "member",
					otherwise: new MessageEmbed({
						color: errorColor,
						description: "Can't find this user.",
					}),
				},
				{
					id: "reason",
					type: "string",
					match: "content",
					default: "kicked",
				},
			],
		});
	}
	async exec(message: Message, { member, reason }: { member: GuildMember, reason: string}): Promise<Message> {

		if (message.author.id != message.guild?.ownerID && (message.member as GuildMember).roles.highest.comparePositionTo(member.roles.highest) > 0) {
			return message.channel.send(new MessageEmbed({
				color: errorColor,
				description: "You don't have permissions to ban this member.",
			}));
		}

		try {
			await member.user.send(new MessageEmbed({
				color: errorColor,
				description: `You have been kicked from ${message.guild?.name}.\nReason: ${reason}`,
			}));
		}
		catch {
			// ignored
		}

		await member.kick(reason);

		return message.channel.send(new MessageEmbed({
			title: "Kicked user",
			color: await getMemberColorAsync(message),
			fields: [
				{ name: "Username", value: member.user.username, inline: true },
				{ name: "ID", value: member.user.id, inline: true },
			],
		}));
	}
}