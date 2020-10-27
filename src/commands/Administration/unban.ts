import { Command } from "discord-akairo";
import { Message, MessageEmbed, User } from "discord.js";
import { errorColor, getMemberColorAsync } from "../../functions/Util";

export default class UnbanCommand extends Command {
	constructor() {
		super("unban", {
			aliases: ["unban", "ub"],
			userPermissions: "BAN_MEMBERS",
			clientPermissions: "BAN_MEMBERS",
			args: [
				{
					id: "user",
					type: "user",
					otherwise: new MessageEmbed({
						color: errorColor,
						description: "Can't find this user.",
					}),
				},
			],
		});
	}
	async exec(message: Message, { user }: { user: User }): Promise<Message> {

		const bans = await message.guild?.fetchBans();

		if (bans?.find((u) => u.user.id === user.id)) {
			await message.guild?.members.unban(user);
			return message.channel.send(new MessageEmbed({
				color: await getMemberColorAsync(message),
				description: `Unbanned ${user.tag}.`,
			}));
		}
		else {
			return message.channel.send(new MessageEmbed({
				color: errorColor,
				description: "This user is not banned.",
			}));
		}
	}
}