import { Command } from "discord-akairo";
import { GuildMember, MessageEmbed, Message, Role } from "discord.js";
import { noArgRole } from "../../util/embeds";

export default class RoleHoistCommand extends Command {
	constructor() {
		super("rolehoist", {
			aliases: ["rolehoist", "hoistrole", "hoist"],
			clientPermissions: "MANAGE_ROLES",
			userPermissions: "MANAGE_ROLES",
			description: { description: "Hoists or unhoists a role", usage: "@gamers" },
			channel: "guild",
			args: [
				{
					id: "role",
					type: "role",
					otherwise: noArgRole,
				},
			],
		});
	}

	public async exec(message: Message, { role }: { role: Role}): Promise<Message> {

		if (role.hoist) {
			role.setHoist(false);
		}
		else {
			role.setHoist(true);
		}

		return message.channel.send(new MessageEmbed({
			color: await (message.member as GuildMember).getMemberColorAsync(),
			description: `Toggled ${role.name}'s hoist status to ${!role.hoist}.`,
		}));

	}
}