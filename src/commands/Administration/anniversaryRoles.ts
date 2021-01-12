import { Guild, Message, MessageEmbed } from "discord.js";
import { Command } from "@cataclym/discord-akairo";
import db from "quick.db";
import { GuildOnAddBirthdays } from "../../nsb/AnniversaryRoles.js";
import { noArgGeneric } from "../../nsb/Embeds";
const guildConfig = new db.table("guildConfig");

export default class AnniversaryRolesConfigCommand extends Command {
	constructor() {
		super("config-anniversary", {
			userPermissions: "ADMINISTRATOR",
			channel: "guild",
			args: [
				{
					id: "value",
					type: ["enable", "true", "disable", "false"],
					otherwise: (message: Message) => noArgGeneric(message),
				},
			],
		});
	}
	public async exec(message: Message, { value }: { value: "enable" | "true" | "disable" | "false" }): Promise<Message> {
		const isEnabled: boolean = guildConfig.get(`${message.guild?.id}`).anniversary,
			embed = new MessageEmbed().setColor(await message.getMemberColorAsync());

		switch (value) {
			case ("enable"):
			case ("true"): {
				if (!isEnabled) {
					guildConfig.set(`${message.guild?.id}.anniversary`, !isEnabled);
					GuildOnAddBirthdays(<Guild> message.guild);
					return message.channel.send(embed.setDescription(`Anniversary-roles functionality has been enabled in ${message.guild?.name}!`));
				}
				else {
					return message.channel.send(embed.setDescription("You have already enabled Anniversary-roles."));
				}
			}
			case ("disable"):
			case ("false"): {
				if (isEnabled) {
					guildConfig.set(`${message.guild?.id}.anniversary`, !isEnabled);
					return message.channel.send(embed.setDescription(`Anniversary-roles functionality has been disabled in ${message.guild?.name}!`));
				}
				else {
					return message.channel.send(embed.setDescription("You have already disabled Anniversary-roles."));
				}
			}
		}
	}
}