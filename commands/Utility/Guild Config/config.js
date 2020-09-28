"use strict";
const { Command, Flag, Argument } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const guildConfig = new db.table("guildConfig");

module.exports = class ConfigCommand extends Command {
	constructor() {
		super("config", {
			name: "config",
			aliases: ["config", "configure"],
			description: {
				description: "Configure guild settings",
			},
		});
	}
	*args() {
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

	async exec(message) {

		const enabledDadBotGuilds = guildConfig.get("dadbot");
		const embed = new MessageEmbed();
		const enabledAnniversaryGuilds = guildConfig.get("anniversary");
		let dadbotEnabled = false;
		let anniversaryRolesEnabled = false;

		if (enabledDadBotGuilds.includes(message.guild.id)) {
			dadbotEnabled = true;
		}
		if (enabledAnniversaryGuilds.includes(message.guild.id)) {
			anniversaryRolesEnabled = true;
		}
		embed.addField("DadBot", dadbotEnabled, true);
		embed.addField("Anniversary-Roles", anniversaryRolesEnabled, true);
		message.util.send(embed);
	// Execute message to show what is enabled/disabled
	// TODO: rename some things
	}
};