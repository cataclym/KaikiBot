import { Message, MessageEmbed, version } from "discord.js";
import Akairo, { Command } from "@cataclym/discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { getCommandStatsDB } from "../../struct/db";

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

		const guildCache = this.client.guilds.cache,
			createEmbed = () => new MessageEmbed()
				.setAuthor("© 2020 @Cata#2702", message.client.user?.displayAvatarURL({ dynamic: true }), "https://gitlab.com/cataclym/nadekosengokubot")
				.withOkColor(message),
			db = await getCommandStatsDB(),
			stats = Object.entries(db.count).sort();

		const pages = [new MessageEmbed()
			.setAuthor(`Nadeko Sengoku Bot v${process.env.npm_package_version}`, message.client.user?.displayAvatarURL({ dynamic: true }), "https://gitlab.com/cataclym/nadekosengokubot")
			.setDescription("**Built using**:")
			.addFields([
				{ name: "Discord.js library", value: `[Discord.js](https://discord.js.org/#/ 'Discord.js website') v${version}`, inline: true },
				{ name: "Discord-Akairo framework", value: `[Discord-Akairo](https://discord-akairo.github.io/#/ 'Discord-Akairo website') v${Akairo.version}`, inline: true },
				{ name: "Running on Node.js", value: `[Node.js](https://nodejs.org/en/ 'Node.js website') ${process.version}`, inline: true },
				{ name: "Memory Usage", value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, inline: true },
				{ name: "Uptime", value: format(process.uptime()), inline: true },
				{ name: "Users", value: message.client.users.cache.size, inline: true },
				{ name: "Presence", value: `Guilds: **${guildCache.size}**\nText channels: **${guildCache
					.map(g => g.channels.cache
						.filter(channel => (channel.type !== "voice") && channel.type !== "category").size)
					.reduce((a, b) => a + b, 0)}**\nVoice channels: **${guildCache
					.map(g => g.channels.cache.filter(channel => channel.type === "voice").size)
					.reduce((a, b) => a + b, 0)}**`, inline: true },
			])
			.withOkColor(message)];

		for (let i = 0, l = 25; i < stats.length; i += 25, l += 25) {
			const emb = createEmbed()
				.setTitle("Command stats")
				.withOkColor(message);

			stats.slice(i, l).forEach(([key, value]) => {
				emb.addField(key, value, true);
			});

			if (!emb.fields.length) return;

			pages.push(emb);
		}

		await Promise.resolve(pages);
		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
};
