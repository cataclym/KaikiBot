"use strict";

import { Guild, Message, MessageEmbed } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util";
import { Command } from "discord-akairo";
import db from "quick.db";
import { GuildOnAddBirthdays } from "../../functions/AnniversaryRoles.js";
const guildConfig = new db.table("guildConfig");

export default class AnniversaryRolesConfigCommand extends Command {
	constructor() {
		super("config-anniversary", {
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
	public async exec(message: Message, { value }: { value: string}): Promise<Message | void> {
		const enabledGuilds = guildConfig.get("anniversary");
		const embed = new MessageEmbed().setColor(await getMemberColorAsync(message));
		switch (value) {
			case ("enable"):
			case ("true"): {
				if (!enabledGuilds.includes(message.guild?.id)) {
					enabledGuilds.push(message.guild?.id);
					guildConfig.set("anniversary", enabledGuilds);
					GuildOnAddBirthdays(<Guild> message.guild);
					return message.util?.send(embed.setDescription(`Anniversary-roles functionality has been enabled in ${message.guild?.name}!`));
				}
				else {
					return message.util?.send(embed.setDescription("You have already enabled Anniversary-roles."));
				}
			}
			case ("disable"):
			case ("false"): {
				if (enabledGuilds.includes(message.guild?.id)) {
					await enabledGuilds.splice(enabledGuilds.indexOf(message.guild?.id), 1);
					guildConfig.set("anniversary", enabledGuilds);
					return message.util?.send(embed.setDescription(`Anniversary-roles functionality has been disabled in ${message.guild?.name}!`));
				}
				else {
					return message.util?.send(embed.setDescription("You have already disabled Anniversary-roles."));
				}
			}
		}
	}
}