import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import db from "quick.db";
import { noArgGeneric } from "../../nsb/Embeds.js";
const guildConfig = new db.table("guildConfig");

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
		const isEnabled: boolean = guildConfig.get(`${message.guild?.id}`).dadbot,
			embed = new MessageEmbed().setColor(await message.getMemberColorAsync());

		switch (value) {
			case ("enable"):
			case ("true"): {
				if (!isEnabled) {
					guildConfig.set(`${message.guild?.id}.dadbot`, !isEnabled);
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
					guildConfig.set(`${message.guild?.id}.dadbot`, !isEnabled);
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