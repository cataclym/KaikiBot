import { Command } from "discord-akairo";
import { Collection, Role, Message, MessageEmbed } from "discord.js";
import { noArgRole } from "../../functions/embeds";
import { errorColor, getMemberColorAsync } from "../../functions/Util";
const embed = new MessageEmbed({
	color: errorColor,
	description: "Couldn't delete roles!",
});

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
					match: "separate",
					otherwise: noArgRole,
				},
			],
		});
	}

	public async exec(message: Message, { roles }: { roles: Collection<string, Role>[]}): Promise<Message> {

		const every = roles.every(async (collection) => {

			const role = collection.map((r) => r)[0];

			const dr = await role.delete().then(() => {
				return Promise.resolve(true);
			});

			if (dr.valueOf()) {
				return true;
			}
			else {
				return message.channel.send(embed) && false;
			}
		});

		await Promise.all([every]);

		if (every.valueOf()) {
			return message.channel.send(new MessageEmbed({
				color: await getMemberColorAsync(message),
				description: `Deleted: ${roles.map(coll => coll.map(role => role.name)).join(", ")}`,
			}));
		}
		else {
			return message.channel.send(embed);
		}
	}
}