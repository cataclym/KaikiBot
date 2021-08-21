import { GuildMember, Message, MessageEmbed, Permissions } from "discord.js";
import { trim } from "../../lib/Util";
import { KaikiCommand } from "kaiki";
import { restoreUserRoles } from "../../lib/roles";

export default class RestoreUserRoles extends KaikiCommand {
	constructor() {
		super("restore", {
			aliases: ["restore"],
			userPermissions: ["ADMINISTRATOR"],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			description: "Restores roles for a user who has previously left the server.",
			usage: "@dreb",
			channel: "guild",
			args: [
				{
					id: "member",
					type: "member",
					otherwise: (m) => ({ embeds: [new MessageEmbed()
						.setDescription("Please provide a valid member")
						.withErrorColor(m)] }),
				},
			],
		});
	}

	public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message | void> {

		const result = await restoreUserRoles(member);

		if (!result) {
			return;
		}

		else if (result.success) {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`Restored roles of \`${member.user.tag}\` [${member.id}]`)
					.addField("Roles added", trim(result.roles.join("\n"), 1024))
					.withOkColor(message)],
			});
		}

		else if (result.roles) {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription("This member already has all the roles.")
					.withErrorColor(message)],
			});
		}

		else {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription("This user's roles have not been saved, or they have not left the guild.")
					.withErrorColor(message)],
			});
		}
	}
}
