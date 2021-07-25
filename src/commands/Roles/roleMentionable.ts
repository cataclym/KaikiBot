import { Message, MessageEmbed, Role } from "discord.js";
import { noArgRole } from "../../lib/Embeds";
import { KaikiCommand } from "kaiki";


export default class RoleMentionableCommand extends KaikiCommand {
	constructor() {
		super("rolementionable", {
			aliases: ["rolementionable", "rolem", "mentionable"],
			clientPermissions: "MANAGE_ROLES",
			userPermissions: "MANAGE_ROLES",
			description: "Toggles if a role is mentionable",
			usage: "@gamers",
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

		if (role.mentionable) {
			role.setMentionable(false);
		}
		else {
			role.setMentionable(true);
		}

		return message.channel.send({
			embeds: [new MessageEmbed({
				description: `Toggled ${role.name}'s mentionable status to ${!role.mentionable}.`,
			})
				.withOkColor(message)],
		});
	}
}
