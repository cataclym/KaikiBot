import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../functions/embeds";
import { errorColor, getMemberColorAsync } from "../../functions/Util";

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
					otherwise: (msg: Message) => noArgGeneric(msg.util?.parsed?.command),
				},
			],
		});
	}
	public async exec(message: Message, { name }: { name: string }): Promise<Message> {

		try {

			const createdRole = await message.guild?.roles.create({ data: { name: name } });

			if (!createdRole) {
				throw ("Role creation failed.");
			}

			return message.channel.send(new MessageEmbed({
				title: "Success!",
				description: `Created ${createdRole}!`,
				color: await getMemberColorAsync(message),
			}));
		}

		catch (e) {
			return message.channel.send(new MessageEmbed({
				title: "Error!",
				description: "An error occured. Could not create role.",
				footer: { text: e },
				color: errorColor,
			}));
		}
	}
}