import Discord, { Message, MessageEmbed } from "discord.js";
import Akairo, { Command } from "discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { getMemberColorAsync } from "../../functions/Util";
import { config } from "../../config";

function format(seconds: number) {

	const days = Math.floor(seconds / (60 * 60 * 24));
	seconds %= (60 * 60 * 24);
	const hours = Math.floor(seconds / (60 * 60));
	seconds %= (60 * 60);
	const minutes = Math.floor(seconds / 60);
	const actualSeconds = Math.floor(seconds % 60);
	return days + "** days**\n" + hours + "** hours**\n" + minutes + "** minutes**\n" + actualSeconds + "** seconds**";
}
module.exports = class StatsCommand extends Command {
	constructor() {
		super("stats", {
			aliases: ["stats"],
			description: { description: "Statistics and information" },
		});
	}
	public async exec(message: Message) {

		const color = await getMemberColorAsync(message);
		const pages = [];
		const guild = this.client.guilds.cache;
		const embed = new MessageEmbed();
		embed.setColor(color);
		embed.setAuthor(`Nadeko Sengoku Bot v${process.env.npm_package_version}`, message.client.user?.displayAvatarURL({ dynamic: true }), "https://gitlab.com/cataclym/nadekosengokubot");
		embed.setDescription("**Built using**:");
		embed.addFields([
			{ name: "Discord.js library", value: `[Discord.js](https://discord.js.org/#/ 'Discord.js website') v${Discord.version}`, inline: true },
			{ name: "Discord-Akairo framework", value: `[Discord-Akairo](https://discord-akairo.github.io/#/ 'Discord-Akairo website') v${Akairo.version}`, inline: true },
			{ name: "Running on Node.js", value: `[Node.js](https://nodejs.org/en/ 'Node.js website') ${process.version}`, inline: true },
			{ name: "Memory Usage", value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, inline: true },
			{ name: "Uptime", value: format(process.uptime()), inline: true },
			{ name: "Users", value: message.client.users.cache.size, inline: true },
			{ name: "Presence", value: "Guilds: " + guild.size +
					"\nText channels: " + guild.map(g => g.channels.cache.filter(channel => (channel.type !== "voice") && channel.type !== "category").size).reduce((a, b) => a + b, 0) +
				"\nVoice channels: " + guild.map(g => g.channels.cache.filter(channel => channel.type === "voice").size).reduce((a, b) => a + b, 0), inline: true },
		]);

		const embed2 = new MessageEmbed()
			.setColor(color)
			.setAuthor(`© 2020 ${this.client.users.cache.get(config.ownerID ?? "")?.tag}`, message.client.user?.displayAvatarURL({ dynamic: true }), "https://gitlab.com/cataclym/nadekosengokubot");
		for (const [key, value] of Object.entries(process.resourceUsage())) {
			embed2.addField(key, value, true);
		}
		pages.push(embed, embed2);
		await Promise.resolve(pages);
		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
};
