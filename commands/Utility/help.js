const Discord = require("discord.js");
const { prefix } = require("../../config.js");
const { version } = require("../../package.json");
const { Command } = require("discord-akairo");

module.exports = class HelpCommand extends Command {
	constructor() {
		super("help", {
			name: "help",
			args: [{
				id: "command",
				type: "commandAlias",
				default: null,
			}],
			aliases: ["help", "h"],
			description: { description: "Shows command info", usage: "ping" },
		});
	}
	async exec(message, args) {
		const embed = new Discord.MessageEmbed();
		embed.setColor(message.member.displayColor);

		if (args.command) {
			embed.setTitle(`**Name:** ${args.command.id}`);
			embed.setDescription(`**Aliases:** \`${args.command.aliases.join("`, `")}\`\n**Description:** ${args.command.description.description}\n
			${(args.command?.description.usage ? "**Usage:** " + prefix + args.command.id + " " + args.command.description.usage : "")}`);
			return message.util.send(embed);
		}
		const AvUrl = await message.client.users.fetch("140788173885276160");
		// Bot author
		embed.setTitle(`${message.client.user.username} help page`);
		embed.setDescription(`Prefix is currently set to \`${prefix}\``);
		embed.addFields([
			{ name: "📋 Command list", value: `For a complete list of commands; type \`${prefix}Cmdlist\``, inline: true },
			{ name: "🔍 Command Info", value: `Use \`${prefix}help [command]\` to get more help! Example: \`${prefix}help ping\``, inline: true },
		]);
		embed.setAuthor(`Nadeko Sengoku Bot v${version}`, message.author.displayAvatarURL({ dynamic: true }), "https://github.com/cataclym/nadekosengokubot");
		embed.setFooter("Made by Cata <3", AvUrl.displayAvatarURL({ dynamic: true }));
		await message.util.send(embed);
	}
};
