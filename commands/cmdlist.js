const Discord = require("discord.js");
const { prefix } = require("../config.js");
const { version } = require("../package.json");

module.exports = {
	name: "cmdlist",
	aliases: ["commands", "commandlist", "commandslist", "cmds"],
	description: "Returns all aliases and commands.",
	async execute(message, cmd, client) {

		const CommandsCollection = message.client.commands;
		let Cmdslist = CommandsCollection.map(t => t).filter(a => !!a).sort();
		Cmdslist = [...Cmdslist];
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
			},
		});
		const names = CommandsCollection.map(t => t.name).filter(a => !!a).sort();
		for (const [i, value] of names.entries()) {
			const alias = Cmdslist[i].aliases;
			await embed.addField(prefix+value, alias, true);
		}
		await embed.addField("\u200B", "\u200B", true);
		await message.channel.send(embed);
	},
};