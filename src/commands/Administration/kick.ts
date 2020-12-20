import { Command } from "discord-akairo";
import { Guild } from "discord.js";
import { MessageEmbed, Message, GuildMember } from "discord.js";
import { errorColor } from "../../util/Util";

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
					otherwise: new MessageEmbed({
						color: errorColor,
						description: "Can't find this user.",
					}),
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
				color: errorColor,
				description: "You don't have permissions to kick this member.",
			}));
		}
		else if (guildClientMember.roles.highest.position <= member.roles.highest.position) {
			return message.channel.send(new MessageEmbed({
				color: errorColor,
				description: "Sorry, I don't have permissions to kick this member.",
			}));
		}

		await member.kick(reason).then(m => {
			try {
				m.user.send(new MessageEmbed({
					color: errorColor,
					description: `You have been kicked from ${message.guild?.name}.\nReason: ${reason}`,
				}));
			}
			catch {
				// ignored
			}
		})
			.catch((err) => console.log(err));


		return message.channel.send(new MessageEmbed({
			title: "Kicked user",
			color: await (message.member as GuildMember).getMemberColorAsync(),
			fields: [
				{ name: "Username", value: member.user.username, inline: true },
				{ name: "ID", value: member.user.id, inline: true },
			],
		}));
	}
}