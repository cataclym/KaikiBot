import { Command } from "discord-akairo";
import { MessageEmbed, User, Role, Message, GuildMember } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util";

export default class BanCommand extends Command {
	constructor() {
		super("ban", {
			aliases: ["ban", "bean"],
			userPermissions: ["BAN_MEMBERS"],
			channel: "guild",
		});
	}
	async exec(message: Message, { user }: { user: User}): Promise<Message | void | string | User | GuildMember> {

		const guildMember = message.guild?.members.cache.get(user.id);

		if (!guildMember) {
			return message.guild?.members.ban(user);
		}

		if (message.author.id != message.guild?.ownerID && ((guildMember.roles.cache.sort((r: Role) => r.position) >= ((message.member as GuildMember).roles.cache.sort((r: Role) => r.position))))) {
			return message.channel.send(new MessageEmbed({
				color: await getMemberColorAsync(message),
				description: "You don't have permissions to ban this member.",
			}));
		}

		await message.guild?.members.ban(user, {});
		return message.channel.send(new MessageEmbed({
			title: "Banned user",
			fields: [
				{ name: "Username", value: guildMember.user.username, inline: true },
				{ name: "ID", value: guildMember.user.id, inline: true },
			],
		}));
	}
}