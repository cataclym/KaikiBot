import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, Role, GuildMember } from "discord.js";
import { noArgGeneric } from "../../util/embeds";
import { errorColor, trim } from "../../util/Util";

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
					otherwise: () => new MessageEmbed({
						title: "Can't find a matching role. Try again.",
						color: errorColor,
					}),
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

		if ((role.position < (message.member as GuildMember).roles.highest.position) && !role.managed) {
			try {
				const editRole = role.edit({ name: trim(name.toString(), 32) });
				if (editRole) {
					return message.channel.send(new MessageEmbed({
						title: "Success!",
						description: `Role renamed to ${role}.`,
						color: await message.getMemberColorAsync(),
					}));
				}
				else {
					throw "Failed to edit role name.";
				}
			}
			catch (e) {
				return message.channel.send(new MessageEmbed({
					title: "Error!",
					description: "An error occured. Could not rename role.",
					footer: { text: e },
					color: errorColor,
				}));
			}
		}
		else {
			return message.channel.send(new MessageEmbed({
				title: "Insufficient permission(s).",
				color: errorColor,
			}));
		}
	}
}