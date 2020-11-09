import { Command } from "discord-akairo";
import { Role, Message, MessageEmbed } from "discord.js";
import { noArgRole } from "../../functions/embeds";
import { errorColor, getMemberColorAsync } from "../../functions/Util";

export default class RoleDeleteCommand extends Command {
	constructor() {
		super("roledelete", {
			aliases: ["roledelete", "deleterole", "dr"],
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

	public async exec(message: Message, { roles }: { roles: Role[]}): Promise<Message | void> {

		const rolesArray: string[] = [];

		roles.forEach(async (role: Role) => {
			return rolesArray.push((await role.delete()).name);
		});
		if (rolesArray.length > 0) {
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