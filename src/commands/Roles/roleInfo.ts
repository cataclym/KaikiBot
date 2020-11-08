import { Command } from "discord-akairo";
import { Role } from "discord.js";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

export default class RoleInfoCommand extends Command {
	constructor() {
		super("roleinfo", {
			aliases: ["roleinfo", "role", "rinfo"],
			description: { description: "Shows info about a given role. If no role is supplied, it defaults to current one.", usage: "@Gamers" },
			args: [
				{
					id: "role",
					type: "role",
					match: "content",
					default: (message: Message) => message.member?.roles.highest,
				},
			],
		});
	}
	public async exec(message: Message, { role }: { role: Role }): Promise<Message> {
		return message.channel.send(new MessageEmbed({
			title: `Info for ${role.name}`,
			color: role.hexColor,
			fields: [
				{ name: "ID", value: role.id, inline: true },
				{ name: "Members", value: role.members.size, inline: true },
				{ name: "Color", value: role.hexColor, inline: true },
				{ name: "Hoisted", value: (role.hoist ? "True" : "False"), inline: true },
				{ name: "Mentionable", value: (role.mentionable ? "True" : "False"), inline: true },
				{ name: "Position", value: role.position, inline: true },
				{ name: "Created at", value: role.createdAt.toDateString(), inline: true },
			],
		}));
	}
}