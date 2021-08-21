import { Collection, Guild, GuildMember, Message, MessageEmbed, Role } from "discord.js";
import { roleArgumentError } from "../../lib/Embeds";
import { KaikiCommand } from "kaiki";


export default class RoleDeleteCommand extends KaikiCommand {
	constructor() {
		super("roledelete", {
			aliases: ["roledelete", "deleterole", "dr"],
			clientPermissions: "MANAGE_ROLES",
			userPermissions: "MANAGE_ROLES",
			description: "Deletes one or more roles",
			usage: "@gamers @streamers @weebs",
			channel: "guild",
			args: [
				{
					id: "roles",
					type: "roles",
					match: "separate",
					otherwise: (m) => ({ embeds: [roleArgumentError(m)] }),
				},
			],
		});
	}

	public async exec(message: Message, { roles }: { roles: Collection<string, Role>[]}): Promise<Message> {

		const deletedRoles: string[] = [];
		const otherRoles: string[] = [];

		for await (const collection of roles) {

			const r = collection.map(_r => _r)[0];

			if ((r.position < (message.member as GuildMember).roles.highest.position)
                && r.position < ((message.guild as Guild).me as GuildMember).roles.highest.position
                && !r.managed) {

				r.delete().catch(() => otherRoles.push(r.name));
				deletedRoles.push(r.name);
			}

			else {
				otherRoles.push(r.name);
			}
		}

		if (otherRoles.length) {
			return message.channel.send({ embeds: [new MessageEmbed()
				.setDescription(`Role(s) \`${otherRoles.join("`, `")}\` could not be deleted due to insufficient permissions.`)
				.withErrorColor(message)],
			});
		}

		else if (deletedRoles.length) {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`Deleted: \`${deletedRoles.join("`, `")}\``)
					.withOkColor(message)],
			});
		}

		else {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription("Couldn't delete roles!")
					.withErrorColor(message)],
			});
		}
	}
}
