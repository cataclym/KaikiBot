import { Command } from "@cataclym/discord-akairo";
import { Guild, MessageEmbed, Message, GuildMember } from "discord.js";

export default class KickCommand extends Command {
	constructor() {
		super("kick", {
			aliases: ["kick", "k"],
			userPermissions: ["KICK_MEMBERS"],
			clientPermissions: "KICK_MEMBERS",
			description: { description: "Kicks a user by ID or name with an optional message.", usage: "<@some Guy> Your behaviour is harmful." },
			channel: "guild",
			args: [
				{
					id: "member",
					type: "member",
					otherwise: (m: Message) => new MessageEmbed({
						description: "Can't find this user.",
					})
						.withErrorColor(m),
				},
				{
					id: "reason",
					type: "string",
					match: "restContent",
					default: "kicked",
				},
			],
		});
	}
	public async exec(message: Message, { member, reason }: { member: GuildMember, reason: string}): Promise<Message> {

		const guild = message.guild as Guild;
		const guildClientMember = guild.me as GuildMember;

		if (message.author.id !== message.guild?.ownerID &&
			(message.member as GuildMember).roles.highest.position <= member.roles.highest.position) {

			return message.channel.send(new MessageEmbed({
				description: "You don't have permissions to kick this member.",
			})
				.withErrorColor(message));
		}
		else if (guildClientMember.roles.highest.position <= member.roles.highest.position) {
			return message.channel.send(new MessageEmbed({
				description: "Sorry, I don't have permissions to kick this member.",
			})
				.withErrorColor(message));
		}

		await member.kick(reason).then(m => {
			try {
				m.user.send(new MessageEmbed({
					description: `You have been kicked from ${message.guild?.name}.\nReason: ${reason}`,
				})
					.withErrorColor(message));
			}
			catch {
				// ignored
			}
		})
			.catch((err) => console.log(err));

		return message.channel.send(new MessageEmbed({
			title: "Kicked user",			fields: [
				{ name: "Username", value: member.user.username, inline: true },
				{ name: "ID", value: member.user.id, inline: true },
			],
		})
			.withOkColor(message));
	}
}