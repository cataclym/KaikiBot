import Discord from "discord.js";
import { config } from "../../config";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { getMemberColorAsync } from "../../functions/Util.js";

module.exports = class commandsList extends Command {
	constructor() {
		super("cmdlist", {
			aliases: ["commands", "cmds", "cmdlist"],
			description: "Returns all aliases and commands.",
		});
	}

	async exec(message: Message) {
		const AvUrl = await message.client.users.fetch("140788173885276160");
		// Bot author
		const color = await getMemberColorAsync(message);
		const embed = new Discord.MessageEmbed({
			title: "List of commands for Nadeko Sengoku",
			description: `Prefix is currently set to \`${config.prefix}\`\n`,
			author: {
				name: `Nadeko Sengoku Bot v${process.env.npm_package_version}`,
				url: "https://gitlab.com/cataclym/nadekosengokubot",
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
			if (["default"].includes(category.id)) continue;

			embed.addField(category.id, category
				.filter(cmd => cmd.aliases.length > 0)
				.map(cmd => `**\`${cmd}\`**`)
				.join(", ") || "Empty");
		}
		await message.channel.send(embed);
	}
};