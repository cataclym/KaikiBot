import Discord, { Message } from "discord.js";
import { Command } from "discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { getMemberColorAsync } from "../../functions/Util";

async function formatBytes(a: number, b = 2) {
	if (a === 0) return "0 Bytes";
	const c = b < 0 ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024));return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d];
}

module.exports = class StatsCommand extends Command {
	constructor() {
		super("stats", {
			aliases: ["stats"],
			description: { description: "Shows basic statistics" },
		});
	}
	async exec(message: Message) {

		const color = await getMemberColorAsync(message);
		const pages = [];
		const guilds = message.client.guilds.cache.array();
		const channels = {
			textChannels: 0,
			voiceChannels: 0,
		};
		guilds.map(g => g.channels.cache.filter(channel => (channel.type !== "voice") && channel.type !== "category").map(async () => channels.textChannels++));
		guilds.map(g => g.channels.cache.filter(channel => channel.type === "voice").map(async () => channels.voiceChannels++));
		const embed = new Discord.MessageEmbed();
		embed.setColor(color);
		embed.setAuthor(`Nadeko Sengoku Bot v${process.env.npm_package_version}`, message.client.user?.displayAvatarURL({ dynamic: true }), "https://github.com/cataclym/nadekosengokubot");
		embed.setDescription("**Built using**:");
		embed.addFields([
			{ name: "Discord.js library", value: "[Discord.js](https://discord.js.org/#/ 'Discord.js website') v12.3+", inline: true },
			{ name: "Discord-Akairo framework", value: "[Discord-Akairo](https://discord-akairo.github.io/#/ 'Discord-Akairo website') v8.1+", inline: true },
			{ name: "Running on Node.js", value: `[Node.js](https://nodejs.org/en/ 'Node.js website') ${process.version}`, inline: true },
			{ name: "Memory: heap used", value: await formatBytes(process.memoryUsage().heapUsed), inline: true },
			{ name: "Memory: heap total", value: await formatBytes(process.memoryUsage().heapTotal), inline: true },
			{ name: "Memory: rss", value: await formatBytes(process.memoryUsage().rss), inline: true },
			{ name: "Uptime", value: new Date(1000 * process.uptime()).toISOString().substr(11, 8), inline: true },
			{ name: "Users", value: message.client.users.cache.size, inline: true },
			{ name: "Presence", value: "Guilds: " + guilds.length +
					"\nText channels: " + channels.textChannels +
				"\nVoice channels: " + channels.voiceChannels, inline: true },
		]);
		const embed2 = new Discord.MessageEmbed()
			.setColor(color)
			.setAuthor("Made with ❤ by Cata", message.client.user?.displayAvatarURL({ dynamic: true }), "https://github.com/cataclym/nadekosengokubot");
		for (const [key, value] of Object.entries(process.resourceUsage())) {
			embed2.addField(key, value, true);
		}
		pages.push(embed, embed2);
		await Promise.resolve(pages);
		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
};
