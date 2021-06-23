import { Argument, Command } from "@cataclym/discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { GuildMember, Message, MessageEmbed, Role, TextChannel } from "discord.js";
import { codeblock } from "../../lib/Util";

export default class CheckPermissionsCommand extends Command {
	constructor() {
		super("checkpermissions", {
			aliases: ["checkperms", "cp", "perms"],
			description: {
				description: "Lists perms for role/member",
				usage: ["", "@user", "@role", "@user #channel"] },
			args: [
				{
					id: "input",
					type: Argument.union("role", "member"),
					default: (message: Message) => message.member,
				},
				{
					id: "channel",
					type: "textChannel",
					default: (message: Message) => message.channel,
				},
			],
		});
	}

	public async exec(message: Message, { input, channel }: { input: Role | GuildMember, channel: TextChannel }): Promise<Message> {

		const { permissions } = input,
			permissionsIn = input.permissionsIn(message.channel),
			inputName = input instanceof Role ? input.name : input.user.tag;

		const pages = [];

		if (permissionsIn.bitfield !== permissions.bitfield) {
			pages.push(new MessageEmbed()
				.withOkColor(message)
				.setTitle(`Permissions for ${inputName} in #${channel.name}`)
				.setDescription(await codeblock(permissionsIn
					.toArray()
					.sort()
					.join("\n"))),
			);

			if (message.channel.id !== channel.id) {
				return message.channel.send({ embeds: [pages[0]] });
			}
		}

		else if (message.channel.id !== channel.id) {
			pages.push(new MessageEmbed()
				.withOkColor(message)
				.setTitle(`Permissions for ${inputName} in #${channel.name}`)
				.setDescription(await codeblock(permissionsIn
					.toArray()
					.sort()
					.join("\n"))),
			);
		}

		else {
			pages.push(new MessageEmbed()
				.withOkColor(message)
				.setTitle(`General permissions for ${inputName}`)
				.setDescription(await codeblock(permissions
					.toArray()
					.sort()
					.join("\n"))),
			);
		}

		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
}