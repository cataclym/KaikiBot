import { Command } from "discord-akairo";
import { Message, MessageEmbed, GuildMember } from "discord.js";
import db from "quick.db";
import { errorColor, getMemberColorAsync } from "../../util/Util";
const leaveRoleTable = new db.table("leaveRoleTable");

export default class RestoreUserRoles extends Command {
	constructor() {
		super("restore", {
			aliases: ["restore"],
			userPermissions: ["ADMINISTRATOR", "MANAGE_ROLES"],
			description: { description: "Restores roles for a user who has previously left the server.", usage: "@dreb" },
			channel: "guild",
			args: [
				{
					id: "member",
					type: "member",
					prompt: {
						start: "Specify a member?",
						retry: "I-I-Invalid member! Try again.",
					},
				},
			],
		});
	}
	public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {

		if (leaveRoleTable.get(`${member.guild.id}.${member.id}`)) {
			const savedRoles = leaveRoleTable.get(`${member.guild.id}.${member.id}`);
			member.roles.add(savedRoles);
			return message.channel.send(new MessageEmbed().setColor(await getMemberColorAsync(message)).setDescription(`Restored roles of ${member.user.tag}`));
		}

		else {
			return message.channel.send(new MessageEmbed().setColor(errorColor).setDescription("This user's roles have not been saved, or user has never left the guild."));
		}
	}
}