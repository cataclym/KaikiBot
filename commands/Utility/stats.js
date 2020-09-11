const Discord = require("discord.js");
const { version } = require("../../package.json");
const { Command } = require("discord-akairo");

async function formatBytes(a, b = 2) {
	if (a === 0) return "0 Bytes";
	const c = b < 0 ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024));return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d];
}

module.exports = class StatsCommand extends Command {
	constructor() {
		super("stats", {
			name: "stats",
			aliases: ["stats"],
			description: { description: "Shows basic statistics" },
		});
	}
	async exec(message) {

		const guilds = message.client.guilds.cache.array();
		const channels = {
			textChannels: 0,
			voiceChannels: 0,
		};
		guilds.map(g => g.channels.cache.filter(channel => (channel.type !== "voice") && channel.type !== "category").map(() => channels.textChannels++));
		guilds.map(g => g.channels.cache.filter(channel => channel.type === "voice").map(() => channels.voiceChannels++));
		const embed = new Discord.MessageEmbed();
		embed.setColor(message.member.displayColor);
		embed.setDescription("**Built using**:");
		embed.addFields([
			{ name: "Discord.js library", value: "[Discord.js](https://discord.js.org/#/ 'Discord.js website')", inline: true },
			{ name: "Discord-Akairo library", value: "[Discord-Akairo](https://discord-akairo.github.io/#/ 'Discord-Akairo website')", inline: true },
			{ name: "Running on Node.js", value: "[Node.js](https://nodejs.org/en/ 'Node.js website')", inline: true },
			{ name: "Memory: heap used", value: await formatBytes(process.memoryUsage().heapUsed), inline: true },
			{ name: "Memory: heap total", value: await formatBytes(process.memoryUsage().heapTotal), inline: true },
			{ name: "Memory: rss", value: await formatBytes(process.memoryUsage().rss), inline: true },
			{ name: "Uptime", value: new Date(1000 * process.uptime()).toISOString().substr(11, 8), inline: true },
			{ name: "Presence", value: "Guilds: " + guilds.length +
					"\nText channels: " + channels.textChannels +
				"\nVoice channels: " + channels.voiceChannels, inline: true },
		]);
		embed.setAuthor(`Nadeko Sengoku Bot v${version}`, message.author.displayAvatarURL({ dynamic: true }), "https://github.com/cataclym/nadekosengokubot");
		embed.setFooter("❤", message.client.user.displayAvatarURL({ dynamic: true }));
		await message.util.send(embed);
	}
};
