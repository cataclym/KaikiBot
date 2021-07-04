import { Argument } from "discord-akairo";
import { sendPaginatedMessage } from "@cataclym/discord.js-pagination-ts-nsb";
import { GuildMember, Message, MessageEmbed, Role, TextChannel } from "discord.js";
import { codeblock } from "../../lib/Util";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class CheckPermissionsCommand extends KaikiCommand {
	constructor() {
		super("checkpermissions", {
			aliases: ["checkperms", "cp", "perms"],
			description: "Lists perms for role/member",
			usage: ["", "@user", "@role", "@user #channel"],
			channel: "guild",
			args: [{
				id: "input",
				type: Argument.union("role", "member"),
				default: (message: Message) => message.member,
			},
			{
				id: "channel",
				type: "textChannel",
				default: (message: Message) => message.channel,
			}],
		});
	}

	public async exec(message: Message, { input, channel }: { input: Role | GuildMember, channel: TextChannel }): Promise<Message> {

		const { permissions } = input,
			permissionsIn = input.permissionsIn(message.channel as TextChannel),
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

		return sendPaginatedMessage(message, pages, {});
	}
}
