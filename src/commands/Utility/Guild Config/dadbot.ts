"use strict";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import db from "quick.db";
import { getMemberColorAsync } from "../../../functions/Util.js";
import { config } from "../../../config.js";
const guildConfig = new db.table("guildConfig");
import { updateVar } from "../../../listeners/message";

module.exports = class DadBotConfigCommand extends Command {
	constructor() {
		super("config-dadbot", {
			userPermissions: "ADMINISTRATOR",
			args: [
				{
					id: "value",
					index: 0,
					type: "string",
				},
			],

		});
	}
	public async exec(message: Message, { value }: { value: string}) {
		const enabledGuilds = guildConfig.get("dadbot");
		console.log(value);

		const embed = new MessageEmbed().setColor(await getMemberColorAsync(message));

		switch (value) {
			case ("enable"):
			case ("true"): {
				if (!enabledGuilds.includes(message.guild?.id)) {
					await enabledGuilds.push(message.guild?.id);
					updateVar(enabledGuilds);
					guildConfig.set("dadbot", enabledGuilds);
					embed.setDescription(`DadBot functionality has been enabled in ${message.guild?.name}!\nIndividual users can still disable dadbot on themselves with ${config.prefix}exclude.`);
					return message.util?.send(embed);
				}
				else {
					embed.setDescription("You have already enabled DadBot.");
					return message.util?.send(embed);
				}
			}
			case ("disable"):
			case ("false"): {
				if (enabledGuilds.includes(message.guild?.id)) {
					await enabledGuilds.splice(enabledGuilds.indexOf(message.guild?.id), 1);
					updateVar(enabledGuilds);
					guildConfig.set("dadbot", enabledGuilds);
					embed.setDescription(`DadBot functionality has been disabled in ${message.guild?.name}!`);
					return message.util?.send(embed);
				}
				else {
					embed.setDescription("You have already disabled DadBot.");
					return message.util?.send(embed);
				}
			}
		}
	}
};