"use strict";
import { Command, Flag, Argument } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import db from "quick.db";
import { getMemberColorAsync } from "../../functions/Util";
const guildConfig = new db.table("guildConfig");

export default class ConfigCommand extends Command {
	constructor() {
		super("config", {
			aliases: ["config", "configure"],
			description: {
				description: "Configure guild specific settings",
				usage: "dadbot enable",
			},
		});
	}
	*args(): unknown {
		const method = yield {
			type: [
				["config-dadbot", "dadbot", "dad"],
				["config-anniversary", "anniversary", "roles", "anniversaryroles"],
			],
		};
		if (!Argument.isFailure(method)) {
			return Flag.continue(method);
		}
	}

	async exec(message: Message): Promise<Message | void> {

		const enabledDadBotGuilds = guildConfig.get("dadbot");
		const embed = new MessageEmbed().setColor(await getMemberColorAsync(message));
		const enabledAnniversaryGuilds = guildConfig.get("anniversary");
		let dadbotEnabled = false;
		let anniversaryRolesEnabled = false;

		if (enabledDadBotGuilds.includes(message.guild?.id)) {
			dadbotEnabled = true;
		}
		if (enabledAnniversaryGuilds.includes(message.guild?.id)) {
			anniversaryRolesEnabled = true;
		}
		embed.addField("DadBot", dadbotEnabled, true);
		embed.addField("Anniversary-Roles", anniversaryRolesEnabled, true);
		message.util?.send(embed);
	// Execute message to show what is enabled/disabled
	// TODO: rename some things
	}
}