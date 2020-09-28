"use strict";
const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { prefix } = require("../../../config.js");
const { GuildOnAddBirthdays } = require("../../../functions/AnniversaryRoles.js");
const guildConfig = new db.table("guildConfig");

module.exports = class AnniversaryRolesConfigCommand extends Command {
	constructor() {
		super("config-anniversary", {
			id: "config-anniversary",
			aliases: ["config-anniversary"],
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
		const enabledGuilds = guildConfig.get("anniversary");
		switch (args.value) {
			case ("enable"):
			case ("true"): {
				if (!enabledGuilds.includes(message.guild.id)) {
					enabledGuilds.push(message.guild.id);
					guildConfig.set("anniversary", enabledGuilds);
					GuildOnAddBirthdays(message.guild);
					return message.util.send(new MessageEmbed().setDescription(`Anniversary-roles functionality has been enabled in ${message.guild.name}!\nIndividual users can still disable dadbot on themselves with ${prefix}exclude.`));
				}
				else {
					return message.util.send(new MessageEmbed().setDescription("You have already enabled Anniversary-roles."));
				}
			}
			case ("disable"):
			case ("false"): {
				if (enabledGuilds.includes(message.guild.id)) {
					await enabledGuilds.splice(enabledGuilds.indexOf(message.guild.id), 1);
					guildConfig.set("anniversary", enabledGuilds);
					return message.util.send(new MessageEmbed().setDescription(`Anniversary-roles functionality has been disabled in ${message.guild.name}!`));
				}
				else {
					return message.util.send(new MessageEmbed().setDescription("You have already disabled Anniversary-roles."));
				}
			}
		}
	}
};