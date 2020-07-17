const Discord = require("discord.js");
const { prefix } = require("../config.js");
const { version } = require("../package.json");

module.exports = {
	name: "cmdlist",
	aliases: ["commands", "commandlist", "commandslist", "cmds"],
	description: "Returns all aliases and commands.",
	async execute(message) {

		const CommandsCollection = await message.client.commands;
		const Cmdslist = await CommandsCollection.map(t => t).filter(a => !!a).sort();
		const AvUrl = await message.client.users.fetch("140788173885276160"); // Bot author 

		const color = message.member.displayColor;
		const embed = new Discord.MessageEmbed({
			title: "List of commands for Nadeko Sengoku",
			description: `Prefix is currently set to \`${prefix}\`\n`,
			author: {
				name: `Nadeko Sengoku Bot v${version}`,
				url: "https://github.com/cataclym/nadekosengokubot",
				icon_url: message.author.displayAvatarURL(),
			},
			thumbnail: {
				url: "https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png",
			},
			color,
			footer: {
				text: "Made by Cata <3",
				icon_url: AvUrl.displayAvatarURL(),
			},
		});
		const names = await Cmdslist.map(t => t.name).filter(a => !!a).sort(function(a, b){return b-a;});
		for (const [i, value] of names.entries()) {
			const alias = Cmdslist[i].aliases;
			embed.addField(prefix+value, alias, true);
		}
		embed.addField("\u200B", "\u200B", true);
		await message.channel.send(embed);
	},
};