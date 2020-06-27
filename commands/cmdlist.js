const Discord = require("discord.js");
const { prefix } = require("../config.js");
const { version } = require("../package.json");

module.exports = {
	name: "cmdlist",
	aliases: ["commands", "commandlist", "commandslist", "cmds"],
	description: "Returns all aliases and commands.",
	execute(message, cmd) {
		const color = message.member.displayColor;
		const embed = new Discord.MessageEmbed({
			title: "List of commands for Nadeko Sengoku",
			description: `Prefix is currently set to \`${prefix}\`\n`,
			author: {
				name: `Nadeko Sengoku Bot v${version}`,
				url: "https://github.com/cataclym/nadekosengokubot",
				icon_url: message.author.displayAvatarURL(),
			},
			color,
			fields: [
				{
					name: `${prefix}Help`,
					value: "```css\n[help]\n```",
					inline: true,
				},
				{
					name: `${prefix}Die`,
					value: "```css\n[die, kill, murder, shutdown]\n```",
					inline: true,
				},
				{
					name: `${prefix}Ping`,
					value: "```css\n[ping]\n```",
					inline: true,
				},
				{
					name: `${prefix}Dadjoke`,
					value: "```css\n[dadjoke, dadjokes]\n```",
					inline: true,
				},
				{
					name: `${prefix}Exclude`,
					value: "```css\n[exclude]\n```",
					inline: true,
				},
				{
					name: `${prefix}Yeet`,
					value: "```css\n[yeet, yeets]\n```",
					inline: true,
				},
				{
					name: `${prefix}Yeetkids`,
					value: "```css\n[yeetkids, yeetkid, yeetingkids]\n```",
					inline: true,
				},
				{
					name: `${prefix}Names`,
					value: "```css\n[names, checknames, getnames, name]\n```",
					inline: true,
				},
				{
					name: `${prefix}Delnames`,
					value: "```css\n[delnames, deletenames, namedel, namedelete]\n```",
					inline: true,
				},
				{
					name: `${prefix}Send`,
					value: "```css\n[send] #WIP\n```",
					inline: true,
				},
				{
					name: `${prefix}Test`,
					value: "```css\n[test] #WIP\n```",
					inline: true,
				},
				{
					name: `${prefix}Remind`,
					value: "```css\n[remind] #WIP\n```",
					inline: true,
				},
			],
			footer: {
				text: "Made by Cata <3",
			},
		});
		message.channel.send(embed);
	},
};