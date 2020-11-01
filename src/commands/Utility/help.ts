import Discord, { Message } from "discord.js";
import { config } from "../../config.js";
import { Command } from "discord-akairo";
import { getMemberColorAsync } from "../../functions/Util.js";

export default class HelpCommand extends Command {
	constructor() {
		super("help", {
			args: [{
				id: "command",
				type: "commandAlias",
				default: null,
			}],
			aliases: ["help", "h"],
			description: { description: "Shows command info", usage: "ping" },
		});
	}
	async exec(message: Message, { command }: { command: Command }): Promise<Message | void> {
		const embed = new Discord.MessageEmbed()
			.setColor(await getMemberColorAsync(message));

		if (command) {
			embed.setTitle(`**Name:** ${command.id}`);
			embed.setDescription(`**Aliases:** \`${command.aliases.join("`, `")}\`\n**Description:** ${(command.description.description || command.description)}\n
			${(command?.description.usage ? "**Usage:** " + config.prefix + command.id + " " + command.description.usage : "")}`);
			command.userPermissions ? embed.addField("Requires", command.userPermissions, false) : null;
			command.ownerOnly ? embed.addField("Owner only", "✅", false) : null;
			return message.util?.send(embed);
		}
		const AvUrl = await message.client.users.fetch("140788173885276160", true);
		// Bot author
		embed.setTitle(`${message.client.user?.username} help page`);
		embed.setDescription(`Prefix is currently set to \`${config.prefix}\``);
		embed.addFields([
			{ name: "📋 Command list", value: `For a complete list of commands; type \`${config.prefix}Cmdlist\``, inline: true },
			{ name: "🔍 Command Info", value: `Use \`${config.prefix}help [command]\` to get more help! Example: \`${config.prefix}help ping\``, inline: true },
		]);
		embed.setAuthor(`Nadeko Sengoku Bot v${process.env.npm_package_version}`, message.author.displayAvatarURL({ dynamic: true }), "https://github.com/cataclym/nadekosengokubot");
		embed.setFooter("Made by Cata <3", AvUrl.displayAvatarURL({ dynamic: true }));
		await message.util?.send(embed);
	}
}
