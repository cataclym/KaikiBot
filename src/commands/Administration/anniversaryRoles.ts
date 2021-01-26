import { Guild, Message, MessageEmbed } from "discord.js";
import { Command } from "@cataclym/discord-akairo";
import { GuildOnAddBirthdays } from "../../nsb/AnniversaryRoles.js";
import { noArgGeneric } from "../../nsb/Embeds";
import { customClient } from "../../struct/client.js";

type values = "enable" | "true" | "disable" | "false";
const values: values[] = ["enable", "true", "disable", "false"];

export default class AnniversaryRolesConfigCommand extends Command {
	constructor() {
		super("config-anniversary", {
			userPermissions: "ADMINISTRATOR",
			channel: "guild",
			args: [
				{
					id: "value",
					type: values,
					otherwise: (message: Message) => noArgGeneric(message),
				},
			],
		});
	}
	public async exec(message: Message, { value }: { value: values }): Promise<Message> {
		const client = this.client as customClient;
		const isEnabled: boolean = client.guildDB.get(message.guild!.id, "anniversary", false),
			embed = new MessageEmbed().setColor(await message.getMemberColorAsync());

		switch (value) {
			case ("enable"):
			case ("true"): {
				if (!isEnabled) {
					client.tinderDB.set(message.guild!.id, "anniversary", true);
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
					client.tinderDB.set(message.guild!.id, "anniversary", false);
					return message.channel.send(embed.setDescription(`Anniversary-roles functionality has been disabled in ${message.guild?.name}!`));
				}
				else {
					return message.channel.send(embed.setDescription("You have already disabled Anniversary-roles."));
				}
			}
		}
	}
}