import { Command } from "discord-akairo";
import { Guild } from "discord.js";
import { GuildMember, Message, MessageEmbed, Role } from "discord.js";
import { errorMessage, noArgGeneric } from "../../lib/Embeds";
import { trim } from "../../lib/Util";

export default class RoleRenameCommand extends Command {
	constructor() {
		super("rolerename", {
			aliases: ["rolerename", "rolename", "rn"],
			description: { description: "Renames a given role. The role you specify has to be lower in the role hierarchy than your highest role. Use 'quotes around rolename with spaces'.", usage: "@Gamer weeb" },
			clientPermissions: "MANAGE_ROLES",
			userPermissions: "MANAGE_ROLES",
			channel: "guild",
			args: [
				{
					id: "role",
					type: "role",
					otherwise: (m: Message) => new MessageEmbed({
						title: "Can't find a matching role. Try again.",
					})
						.withErrorColor(m),
				},
				{
					id: "name",
					type: "string",
					match: "rest",
					otherwise: (msg: Message) => noArgGeneric(msg),
				},
			],
		});
	}
	public async exec(message: Message, { role, name }: { role: Role, name: string }): Promise<Message> {


		if ((role.position < (message.member as GuildMember).roles.highest.position)
            && (role.position < ((message.guild as Guild).me as GuildMember).roles.highest.position)
            && !role.managed) {

			const oldName = role.name;

			role.edit({ name: trim(name.toString(), 32) })
				.catch((e) => {
					throw new Error("Error: Failed to edit role.\n" + e);
				});
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setTitle("Success!")
					.setDescription(`\`${oldName}\` renamed to ${role}.`)
					.withOkColor(message)],
			});
		}

		else {
			return message.channel.send({ embeds: [await errorMessage(message, "**Insufficient permissions**\nRole is above you or me in the role hierarchy.")] });
		}
	}
}
