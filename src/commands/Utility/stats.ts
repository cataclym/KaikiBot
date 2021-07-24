import Akairo, { Command } from "discord-akairo";
import { sendPaginatedMessage } from "@cataclym/discord.js-pagination-ts-nsb";
import { execSync } from "child_process";
import { Message, MessageEmbed, version } from "discord.js";
import * as packageJson from "../../../package.json";
import { getCommandStatsDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "../../lib/KaikiClass";

function format(seconds: number) {

	const days = Math.floor(seconds / (60 * 60 * 24));
	seconds %= (60 * 60 * 24);
	const hours = Math.floor(seconds / (60 * 60));
	seconds %= (60 * 60);
	const minutes = Math.floor(seconds / 60);
	return days + "** days**\n" + hours + "** hours**\n" + minutes + "** minutes**";
}
module.exports = class StatsCommand extends KaikiCommand {
	constructor() {
		super("stats", {
			aliases: ["stats"],
			description: "Statistics and information",
		});
	}
	public async exec(message: Message) {

		const guildCache = this.client.guilds.cache,
			createEmbed = () => new MessageEmbed()
				.setAuthor("© 2020 @Cata#2702", message.client.user?.displayAvatarURL({ dynamic: true }), packageJson.repository.url)
				.withOkColor(message),
			db = await getCommandStatsDocument(),
			stats = Object.entries(db.count).sort((a, b) => b[1] - a[1]);

		const pages = [new MessageEmbed()
			.setAuthor(`${packageJson.name} v${packageJson.version}-${execSync("git rev-parse --short HEAD").toString()}`, message.client.user?.displayAvatarURL({ dynamic: true }), packageJson.repository.url)
			.setDescription("**Built using**:")
			.addFields([
				{ name: "Discord.js library", value: `[Discord.js](https://discord.js.org/#/ 'Discord.js website') v${version}`, inline: true },
				{ name: "Discord-Akairo framework", value: `[Discord-Akairo](https://discord-akairo.github.io/#/ 'Discord-Akairo website') v${Akairo.version}`, inline: true },
				{ name: "Running on Node.js", value: `[Node.js](https://nodejs.org/en/ 'Node.js website') ${process.version}`, inline: true },
				{ name: "Memory Usage", value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, inline: true },
				{ name: "Uptime", value: String(format(process.uptime())), inline: true },
				{ name: "Users", value: String(message.client.users.cache.size), inline: true },
				{ name: "Presence", value: `Guilds: **${guildCache.size}**\nText channels: **${guildCache
					.map(g => g.channels.cache
						.filter(channel => (channel.type !== "GUILD_VOICE") && channel.type !== "GUILD_CATEGORY").size)
					.reduce((a, b) => a + b, 0)}**\nVoice channels: **${guildCache
					.map(g => g.channels.cache.filter(channel => channel.type === "GUILD_VOICE").size)
					.reduce((a, b) => a + b, 0)}**`, inline: true }])
			.withOkColor(message)];

		for (let i = 0, l = 25; i < stats.length; i += 25, l += 25) {
			const emb = createEmbed()
				.setTitle("Command stats")
				.withOkColor(message);

			const desc = stats.slice(i, l).map(([key, value]) => {
				return `**${key}**: \`${value}\``;
			});

			emb.setDescription(desc.join("\n"));

			if (!emb.description?.length) return;

			pages.push(emb);
		}

		return sendPaginatedMessage(message, pages, {});
	}
};
