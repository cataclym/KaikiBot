import { Command } from "discord-akairo";
import { Role, Message, MessageEmbed } from "discord.js";
import { noArgRole } from "../../functions/embeds";
import { errorColor, getMemberColorAsync } from "../../functions/Util";

export default class RoleDeleteCommand extends Command {
	constructor() {
		super("roledelete", {
			aliases: ["deleterole", "roledelete", "dr"],
			clientPermissions: "MANAGE_ROLES",
			userPermissions: "MANAGE_ROLES",
			description: { description: "Deletes one or more roles", usage: "@gamers @streamers @weebs" },
			channel: "guild",
			args: [
				{
					id: "roles",
					type: "roles",
					otherwise: noArgRole,
				},
			],
		});
	}

	async exec(message: Message, { roles }: { roles: Role[]}): Promise<Message> {

		const rolesArray: string[] = [];

		roles.forEach((role: Role) => {
			try {
				role.delete().then((r: Role) => rolesArray.push(r.name));
			}
			catch (err) {
				console.error(err);
			}
		});
		if (rolesArray.length) {
			return message.channel.send(new MessageEmbed({
				color: await getMemberColorAsync(message),
				description: `Deleted: ${rolesArray.join(", ")}`,
			}));
		}
		else {
			return message.channel.send(new MessageEmbed({
				color: errorColor,
				description: "Couldn't delete roles!",
			}));
		}
	}
}