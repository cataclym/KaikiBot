"use strict";
import { Command, Flag, Argument } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import db from "quick.db";
import { noArgGeneric } from "../../nsb/Embeds";
import { config } from "../../config";
const guildConfig = new db.table("guildConfig");

export default class ConfigCommand extends Command {
	constructor() {
		super("config", {
			aliases: ["config", "configure"],
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

		const guildConf = guildConfig.get(`${message.guild?.id}`),
			{ anniversary = undefined, dadbot = undefined }: { anniversary: boolean | undefined, dadbot: boolean | undefined } = guildConf;
		let { prefix = undefined }: { prefix: string | undefined } = guildConf;

		const embed = new MessageEmbed().setColor(await message.getMemberColorAsync());

		if (prefix === config.prefix || !prefix) {
			prefix = `\`${config.prefix}\` (Default)`;
		}

		embed.addField("DadBot", dadbot ? "Enabled" : "Disabled", true);
		embed.addField("Anniversary-Roles", anniversary ? "Enabled" : "Disabled", true);
		embed.addField("Guild prefix", prefix, true);
		return message.channel.send(embed);
	}
}