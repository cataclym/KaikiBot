import { Command } from "discord-akairo";
import { MessageEmbed, Message, Role } from "discord.js";
import { noArgRole } from "../../functions/embeds";
import { getMemberColorAsync } from "../../functions/Util";

export default class RoleMentionableCommand extends Command {
	constructor() {
		super("rolementionable", {
			aliases: ["rolementionable", "rolem", "mentionable"],
			clientPermissions: "MANAGE_ROLES",
			userPermissions: "MANAGE_ROLES",
			description: { description: "Toggles if a role is mentionable", usage: "@gamers" },
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

	async exec(message: Message, { role }: { role: Role}): Promise<Message> {

		if (role.mentionable) {
			role.setMentionable(false);
		}
		else {
			role.setMentionable(true);
		}

		return message.channel.send(new MessageEmbed({
			color: await getMemberColorAsync(message),
			description: `Toggled ${role.name}'s mentionable status to ${role.mentionable}.`,
		}));

	}
}