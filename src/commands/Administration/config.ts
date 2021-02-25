import { Argument, Command, Flag, PrefixSupplier } from "@cataclym/discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { config } from "../../config";
import { noArgGeneric } from "../../nsb/Embeds";
import { getGuildDB } from "../../struct/db";

export default class ConfigCommand extends Command {
	constructor() {
		super("config", {
			aliases: ["config", "configure"],
			channel: "guild",
			description: {
				description: "Configure or display guild specific settings",
				usage: ["", "dadbot enable", "anniversary enable", "prefix !", "okcolor <hex>", "errorcolor <hex>"],
			},
			prefix: (msg: Message) => {
				const p = (this.handler.prefix as PrefixSupplier)(msg);
				return [p as string, "-"];
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
				["config-welcome", "welcome", "greet"],
				["config-goodbye", "goodbye", "bye"],
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