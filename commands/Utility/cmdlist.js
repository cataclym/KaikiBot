const Discord = require("discord.js");
const { prefix } = require("../../config.js");
const { version } = require("../../package.json");
const { Command } = require("discord-akairo");

module.exports = class commandsList extends Command {
	constructor() {
		super("cmdlist", {
			aliases: ["commands", "cmds", "cmdlist"],
			description: "Returns all aliases and commands.",
		});
	}

	async exec(message) {
		const AvUrl = await message.client.users.fetch("140788173885276160");
		// Bot author
		const color = message.member.displayColor;
		const embed = new Discord.MessageEmbed({
			title: "List of commands for Nadeko Sengoku",
			description: `Prefix is currently set to \`${prefix}\`\n`,
			author: {
				name: `Nadeko Sengoku Bot v${version}`,
				url: "https://github.com/cataclym/nadekosengokubot",
				icon_url: message.author.displayAvatarURL({ dynamic: true }),
			},
			thumbnail: {
				url: "https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png",
			},
			color,
			footer: {
				text: "Made by Cata <3",
				icon_url: AvUrl.displayAvatarURL({ dynamic: true }),
			},
		});
		for (const category of this.handler.categories.values()) {
			if (["default", "tinder"].includes(category.id)) continue;

			embed.addField(category.id, category
				.filter(cmd => cmd.aliases.length > 0)
				.map(cmd => `**\`${cmd}\`**`)
				.join(", ") || "Empty");
		}
		await message.channel.send(embed);
	}
};