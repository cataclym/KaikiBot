const Discord = require("discord.js");
const { prefix } = require("../config.js");
const { version } = require("../package.json");
const { command, commandName } = require("../index");

module.exports = {
	name: "help",
	description: "Shows command info",
	async execute(message, args) {

		if (args[0]) {
			const commandName = args.shift().toLowerCase();
			// eslint-disable-next-line max-len
			const command = message.client.commands.get(commandName) || message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) return message.channel.send(`Type \`${prefix}cmds\` to see a list of all the commands.`);

			if (command) {
				let cmdmsg = `Description: ${command.description}`;
				if (command.usage) { cmdmsg += `\nUsage: \`${prefix}${command.name} ${command.usage}\``; }

				if (command.aliases) { 
					cmdmsg += `\nAliases: ${command.aliases}`; }
				return message.channel.send(cmdmsg);
			}
		}
		const color = message.member.displayColor;
		let AvUrl = await message.client.users.fetch("140788173885276160");

		const embed = new Discord.MessageEmbed({
			title: `${message.client.user.username} help page`,
			description: `Prefix is currently set to \`${prefix}\``,
			fields: [
				{ name: "📋 Commandlist", value: `For a complete list of commands and aliases type \`${prefix}Cmdlist\``, inline: true, },
				{ name: "🔍 Command Info", value: `Use \`${prefix}help [command]\` to get more help! Example: \`${prefix}help ping\``, inline: true, }
			],
			author: {
				name: `Nadeko Sengoku Bot v${version}`,
				url: "https://github.com/cataclym/nadekosengokubot",
				icon_url: message.author.displayAvatarURL(),
			},
			color,
			footer: {
				text: "Made by Cata <3", 
				icon_url: AvUrl.displayAvatarURL(),
			},
		});
		message.channel.send(embed);
	},
};
