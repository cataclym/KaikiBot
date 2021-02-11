import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { customClient } from "../../struct/client.js";
import { noArgGeneric } from "../../nsb/Embeds.js";

export default class DadBotConfigCommand extends Command {
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
		const embed = new MessageEmbed().setColor(await message.getMemberColorAsync()),
			guildID = (message.guild as Guild).id,
			isEnabled = (message.client as customClient).addons.get(guildID, "dadbot", false);

		switch (value) {
			case ("enable"):
			case ("true"): {
				if (!isEnabled) {
					(message.client as customClient).addons.set(guildID, "dadBot", true);
					embed.setDescription(`DadBot functionality has been enabled in ${message.guild?.name}!\nIndividual users can still disable dadbot on themselves with ${(this.handler.prefix as PrefixSupplier)(message)}exclude.`);
					return message.channel.send(embed);
				}
				else {
					embed.setDescription("You have already enabled DadBot.");
					return message.channel.send(embed);
				}
			}
			case ("disable"):
			case ("false"): {
				if (isEnabled) {
					(message.client as customClient).addons.set(guildID, "dadBot", false);
					embed.setDescription(`DadBot functionality has been disabled in ${message.guild?.name}!`);
					return message.channel.send(embed);
				}
				else {
					embed.setDescription("You have already disabled DadBot.");
					return message.channel.send(embed);
				}
			}
		}
	}
}