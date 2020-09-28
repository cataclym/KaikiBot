"use strict";
const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { prefix } = require("../../../config.js");
const guildConfig = new db.table("guildConfig");
const { updateVar } = require("../../../listeners/message.js");

module.exports = class DadBotConfigCommand extends Command {
	constructor() {
		super("config-dadbot", {
			id: "config-dadbot",
			aliases: ["config-dadbot"],
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
	async exec(message, args) {
		const enabledGuilds = guildConfig.get("dadbot");
		switch (args.value) {
			case ("enable"):
			case ("true"): {
				if (!enabledGuilds.includes(message.guild.id)) {
					await enabledGuilds.push(message.guild.id);
					updateVar(enabledGuilds);
					guildConfig.set("dadbot", enabledGuilds);
					return message.util.send(new MessageEmbed().setDescription(`DadBot functionality has been enabled in ${message.guild.name}!\nIndividual users can still disable dadbot on themselves with ${prefix}exclude.`));
				}
				else {
					return message.util.send(new MessageEmbed().setDescription("You have already enabled DadBot."));
				}
			}
			case ("disable"):
			case ("false"): {
				if (enabledGuilds.includes(message.guild.id)) {
					await enabledGuilds.splice(enabledGuilds.indexOf(message.guild.id), 1);
					updateVar(enabledGuilds);
					guildConfig.set("dadbot", enabledGuilds);
					return message.util.send(new MessageEmbed().setDescription(`DadBot functionality has been disabled in ${message.guild.name}!`));
				}
				else {
					return message.util.send(new MessageEmbed().setDescription("You have already disabled DadBot."));
				}
			}
		}
	}
};