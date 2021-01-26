import { Command, Flag, Argument } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../nsb/Embeds";
import { config } from "../../config";
import { customClient } from "../../struct/client";

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

		const guildConf = (message.client as customClient).guildDB.getDocument(message.guild!.id),
			{ anniversary, dadbot, okColor, errorColor }: { anniversary: boolean, dadbot: boolean, okColor: string, errorColor: string } = guildConf.addons;
		let { prefix }: { prefix: string } = guildConf.addons;

		const embed = new MessageEmbed().setColor(await message.getMemberColorAsync());

		if (prefix === config.prefix) {
			prefix = `\`${config.prefix}\` (Default)`;
		}

		embed.addField("DadBot", dadbot ? "Enabled" : "Disabled", true);
		embed.addField("Anniversary-Roles", anniversary ? "Enabled" : "Disabled", true);
		embed.addField("Guild prefix", prefix, true);
		embed.addField("Embed error color", errorColor, true);
		embed.addField("Embed ok color", okColor, true);
		return message.channel.send(embed);
	}
}