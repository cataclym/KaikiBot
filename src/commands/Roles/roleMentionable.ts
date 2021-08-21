import { Message, MessageEmbed, Role } from "discord.js";
import { roleArgumentError } from "../../lib/Embeds";
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
					otherwise: (m) => ({ embeds: [roleArgumentError(m)] }),
				},
			],
		});
	}

	public async exec(message: Message, { role }: { role: Role}): Promise<Message> {

		const bool = !role.mentionable;

		role.setMentionable(bool);

		return message.channel.send({
			embeds: [new MessageEmbed({
				description: `Toggled ${role.name}'s mentionable status to ${bool}.`,
			})
				.withOkColor(message)],
		});
	}
}
