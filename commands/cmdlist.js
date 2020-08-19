const Discord = require("discord.js");
const { prefix } = require("../config.js");
const { version } = require("../package.json");

module.exports = {
	name: "cmdlist",
	aliases: ["commands", "cmds"],
	description: "Returns all aliases and commands.",
	cmdCategory: "Utility",
	async execute(message) {
		const AvUrl = await message.client.users.fetch("140788173885276160");
		// Bot author
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
		const CommandsCollection = await message.client.commands;
		// Gets all command objects
		const CmdsList = await CommandsCollection.map(t => t.cmdCategory ? t : null).filter(a => !!a).sort();
		// Filter out the nulls
		const array1 = [];
		const cat = [...new Set(CmdsList.map(item => item.cmdCategory).sort())];
		cat.map((CommandCategory) => array1.push(CommandCategory));
		array1.map((x) => embed.addField(x, "\u200B", true));

		for (const [, item] of CmdsList.entries()) {
			const index = array1.indexOf(item.cmdCategory);
			embed.fields[index].value += "**" + prefix + item.name + "**\n" + item.aliases.join("\n") + "\n";
		}

		embed.addField("\u200B", "\u200B", true);
		await message.channel.send(embed);
	},
};