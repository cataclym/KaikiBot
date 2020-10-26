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
					default: (message: Message) => message.channel.send("Specify a user to unban."),
				},
			],
		});
	}
	async exec(message: Message, { user }: { user: User }): Promise<Message> {
		if (message.guild?.fetchBan(user)) {
			{await message.guild?.members.unban(user);}
			return message.channel.send(new MessageEmbed({
				color: await getMemberColorAsync(message),
				description: `Unbanned ${user.tag}.`,
			}));
		}
		else {
			return message.channel.send({
				color: errorColor,
				description: "This user is not banned.",
			});
		}
	}
}