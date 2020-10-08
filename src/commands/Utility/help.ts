import Discord, { Message } from "discord.js";
import { config } from "../../config.js";
import { Command } from "discord-akairo";
import { getMemberColorAsync } from "../../functions/Util.js";

module.exports = class HelpCommand extends Command {
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
	async exec(message: Message, args: any) {
		const embed = new Discord.MessageEmbed()
			.setColor(await getMemberColorAsync(message));

		if (args.command) {
			embed.setTitle(`**Name:** ${args.command.id}`);
			embed.setDescription(`**Aliases:** \`${args.command.aliases.join("`, `")}\`\n**Description:** ${args.command.description.description}\n
			${(args.command?.description.usage ? "**Usage:** " + config.prefix + args.command.id + " " + args.command.description.usage : "")}`);
			args.command.userPermissions ? embed.addField("Requires", args.command.userPermissions, false) : null;
			args.command.ownerOnly ? embed.addField("Owner only", "✅", false) : null;
			return message.util?.send(embed);
		}
		const AvUrl = await message.client.users.fetch("140788173885276160");
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
};
