import { Argument, Command } from "@cataclym/discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { TextChannel, MessageEmbed, GuildMember, Message, Role } from "discord.js";
import { codeblock } from "../../nsb/Util";

export default class CheckPermissionsCommand extends Command {
	constructor() {
		super("checkpermissions", {
			aliases: ["checkperms", "cp"],
			description: {
				description: "Lists perms for role/member",
				usage: ["", "@user", "@role"] },
			args: [
				{
					id: "input",
					type: Argument.union("roles", "member"),
				},
				{
					id: "channel",
					type: "channel",
					default: (message: Message) => message.channel,
				},
			],
		});
	}

	public async exec(message: Message, { input, channel }: { input: Role | GuildMember, channel: TextChannel }): Promise<Message> {

		const { permissions } = input,
			permissionsIn = input.permissionsIn(message.channel);

		const pages = [
			new MessageEmbed()
				.withOkColor(message)
				.setTitle(`Permissions for ${input} in ${channel}`)
				.setDescription(codeblock(permissionsIn.toArray().sort().join("\n"))),

			new MessageEmbed()
				.withOkColor(message)
				.setTitle(`General permissions for ${input}`)
				.setDescription(codeblock(permissions.toArray().sort().join("\n"))),
		];

		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
}