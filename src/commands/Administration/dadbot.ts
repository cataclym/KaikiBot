import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import db from "quick.db";
import { updateVar } from "../../Extensions/Discord";
import { noArgGeneric } from "../../nsb/Embeds.js";
const guildConfig = new db.table("guildConfig");

module.exports = class DadBotConfigCommand extends Command {
	constructor() {
		super("config-dadbot", {
			userPermissions: "ADMINISTRATOR",
			channel: "guild",
			args: [
				{
					id: "value",
					index: 0,
					type: "string",
					otherwise: (message: Message) => noArgGeneric(message),
				},
			],

		});
	}
	public async exec(message: Message, { value }: { value: string}) {
		const enabledGuilds = guildConfig.get("dadbot"),
			embed = new MessageEmbed().setColor(await message.getMemberColorAsync());

		if (value) {
			switch (value) {
				case ("enable"):
				case ("true"): {
					if (!enabledGuilds.includes(message.guild?.id)) {
						await enabledGuilds.push(message.guild?.id);
						updateVar(enabledGuilds);
						guildConfig.set("dadbot", enabledGuilds);
						embed.setDescription(`DadBot functionality has been enabled in ${message.guild?.name}!\nIndividual users can still disable dadbot on themselves with ${(this.handler.prefix as PrefixSupplier)(message)}exclude.`);
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
	}
};