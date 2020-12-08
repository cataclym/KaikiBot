"use strict";
import { Command, Flag, Argument } from "discord-akairo";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import db from "quick.db";
import { noArgGeneric } from "../../util/embeds";
import { config } from "../../config";
const guildConfig = new db.table("guildConfig");

export default class ConfigCommand extends Command {
	constructor() {
		super("config", {
			aliases: ["config", "configure"],
			description: {
				description: "Configure guild specific settings",
				usage: ["dadbot enable", "anniversary enable", "prefix !"],
			},
		});
	}
	*args(): unknown {
		const method = yield {
			type: [
				["config-dadbot", "dadbot", "dad"],
				["config-anniversary", "anniversary", "roles", "anniversaryroles"],
				["config-prefix", "prefix"],
			],
		};
		if (!Argument.isFailure(method)) {
			return Flag.continue(method);
		}
	}

	public async exec(message: Message): Promise<Message | void> {

		if (message.content.split(" ").length > 1) {
			return message.channel.send(noArgGeneric(message));
		}

		const enabledDadBotGuilds = guildConfig.get("dadbot");
		const enabledAnniversaryGuilds = guildConfig.get("anniversary");
		const guildPrefix = guildConfig.get(`${message.guild?.id}.prefix`) as string | undefined;

		const embed = new MessageEmbed().setColor(await (message.member as GuildMember).getMemberColorAsync());

		let dadbotEnabled = false;
		let anniversaryRolesEnabled = false;
		let prefix = `\`${config.prefix}\` (default)`;

		if (enabledDadBotGuilds.includes(message.guild?.id)) {
			dadbotEnabled = true;
		}
		if (enabledAnniversaryGuilds.includes(message.guild?.id)) {
			anniversaryRolesEnabled = true;
		}
		if (guildPrefix) {
			prefix = `\`${guildPrefix}\``;
		}

		embed.addField("DadBot", dadbotEnabled, true);
		embed.addField("Anniversary-Roles", anniversaryRolesEnabled, true);
		embed.addField("Guild prefix", prefix, true);
		message.util?.send(embed);
	// Execute message to show what is enabled/disabled
	// TODO: rename some things
	}
}