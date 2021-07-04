import { PrefixSupplier } from "discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { customClient } from "../../struct/client";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class DadBotConfigCommand extends KaikiCommand {
	constructor() {
		super("config-dadbot", {
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
		const embed = new MessageEmbed().withOkColor(message),
			guildID = (message.guild as Guild).id,
			isEnabled = message.client.guildSettings.get(guildID, "dadBot", false);

		switch (value) {
			case ("enable"):
			case ("true"): {
				if (!isEnabled) {
					await (message.client as customClient).guildSettings.set(guildID, "dadBot", true);
					embed.setDescription(`DadBot functionality has been enabled in ${message.guild?.name}!
					\nIndividual users can still disable dadbot on themselves with ${(this.handler.prefix as PrefixSupplier)(message)}exclude.`);
					return message.channel.send({ embeds: [embed] });
				}
				else {
					embed.setDescription("You have already enabled DadBot.");
					return message.channel.send({ embeds: [embed] });
				}
			}
			case ("disable"):
			case ("false"): {
				if (isEnabled) {
					await (message.client as customClient).guildSettings.set(guildID, "dadBot", false);
					embed.setDescription(`DadBot functionality has been disabled in ${message.guild?.name}!`);
					return message.channel.send({ embeds: [embed] });
				}
				else {
					embed.setDescription("You have already disabled DadBot.");
					return message.channel.send({ embeds: [embed] });
				}
			}
		}
	}
}
