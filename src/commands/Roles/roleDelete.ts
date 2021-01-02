import { Command } from "@cataclym/discord-akairo";
import { Collection, GuildMember, Role, Message, MessageEmbed } from "discord.js";
import { noArgRole } from "../../nsb/Embeds";
import { errorColor } from "../../nsb/Util";
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

		const deletedRoles: string[] = [];
		const otherRoles: string[] = [];

		const every = roles.every(async (collection) => {

			const role = collection.map((r) => r)[0];

			if ((role.position < (message.member as GuildMember).roles.highest.position) && !role.managed) {

				const dr = await role.delete().then((r) => {
					if (r.deleted) {
						deletedRoles.push(r.name);
						return Promise.resolve(true);
					}
				});

				if (dr?.valueOf()) {
					return true;
				}
				else {
					return message.channel.send(embed) && false;
				}
			}
			else {
				// Pass even if role wasnt deleted
				// Because it was a hierarchy fail
				// These roles get summarized at the end, if they happen
				return otherRoles.push(role.name) && true;
			}
		});

		await Promise.all([every]);

		if (otherRoles.length > 0) {
			return message.channel.send(new MessageEmbed({
				color: errorColor,
				description: `Role(s) \`${otherRoles.join("`, `")}\` could not be deleted due to insufficient permissions.`,
			}));
		}
		else if (every.valueOf()) {
			return message.channel.send(new MessageEmbed({
				color: await message.getMemberColorAsync(),
				description: `Deleted: ${roles.map(coll => coll.map(role => role.name)).join(", ")}`,
			}));
		}

		else {
			return message.channel.send(embed);
		}
	}
}