import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";

export default class RoleCreateCommand extends Command {
	constructor() {
		super("rolecreate", {
			aliases: ["rolecreate", "createrole", "rc", "cr"],
			description: { description: "Creates a role with a given name.", usage: "GAMERS" },
			clientPermissions: "MANAGE_ROLES",
			userPermissions: "MANAGE_ROLES",
			channel: "guild",
			args: [
				{
					id: "name",
					type: "string",
					match: "rest",
					otherwise: (msg: Message) => noArgGeneric(msg),
				},
			],
		});
	}
	public async exec(message: Message, { name }: { name: string }): Promise<Message> {

		const createdRole = await message.guild?.roles.create({ name:  name });

		if (!createdRole) {
			throw ("Role creation failed.");
		}

		return message.channel.send({ embeds: [new MessageEmbed({
			title: "Success!",
			description: `Created ${createdRole}!`,
		})
			.withOkColor(message)],
		});
	}
}
