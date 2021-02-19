import { Command, Flag, Argument } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../nsb/Embeds";
import { config } from "../../config";
import { getGuildDB } from "../../struct/db";
import { Guild } from "discord.js";

export default class ConfigCommand extends Command {
	constructor() {
		super("config", {
			aliases: ["config", "configure"],
			channel: "guild",
			description: {
				description: "Configure guild specific settings",
				usage: ["dadbot enable", "anniversary enable", "prefix !", "okcolor <hex>", "errorcolor <hex>"],
			},
		});
	}
	*args(): Generator<{
		type: string[][];
	}, (Flag & {
		command: string;
		ignore: boolean;
		rest: string;
	}) | undefined, unknown> {
		const method = yield {
			type: [
				["config-dadbot", "dadbot", "dad"],
				["config-anniversary", "anniversary", "roles", "anniversaryroles"],
				["config-prefix", "prefix"],
				["config-okcolor", "okcolor"],
				["config-errorcolor", "errorcolor"],
			],
		};
		if (!Argument.isFailure(method)) {
			return Flag.continue(method as string);
		}
	}

	public async exec(message: Message): Promise<Message> {

		if (message.content.split(" ").length > 1) {
			return message.channel.send(noArgGeneric(message));
		}

		const db = await getGuildDB((message.guild as Guild).id),
			{ anniversary, dadBot, prefix, errorColor, okColor } = db.settings;

		return message.channel.send(new MessageEmbed()
			.withOkColor(message)
			.addField("DadBot", dadBot ? "Enabled" : "Disabled", true)
			.addField("Anniversary-Roles", anniversary ? "Enabled" : "Disabled", true)
			.addField("Guild prefix", prefix === config.prefix ? `\`${config.prefix}\` (Default)` : prefix, true)
			.addField("Embed error color", errorColor, true)
			.addField("Embed ok color", okColor, true),
		);
	}
}