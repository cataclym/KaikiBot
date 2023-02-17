import { execSync } from "child_process";
import * as process from "process";
import { version as akairoVersion } from "discord-akairo";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { ChannelType, EmbedBuilder, Message, time, version } from "discord.js";

import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class StatsCommand extends KaikiCommand {
    constructor() {
        super("stats", {
            aliases: ["stats"],
            description: "Statistics and information",
            subCategory: "Info",
        });
    }

    public async exec(message: Message) {

        const packageJSON = this.client.package;
        const { cache } = this.client.guilds;
        const pages = [
            new EmbedBuilder()
                .setAuthor({
                    name: `${packageJSON.name} v${packageJSON.version}-${execSync("git rev-parse --short HEAD").toString()}`,
                    iconURL: message.client.user.displayAvatarURL(),
                    url: packageJSON.repository.url,
                })
                .setDescription("Detailed statistics")
                .addFields([
                    {
                        name: "Memory Usage",
                        value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
                        inline: true,
                    },
                    {
                        name: "Uptime",
                        value: time(new Date(Date.now() - process.uptime() * 1000), "R"),
                        inline: true,
                    },
                    { name: "Users", value: String(message.client.users.cache.size), inline: true },
                    {
                        name: "Presence", value: `Guilds: **${cache.size}**\nText channels: **${cache
                            .map(g => g.channels.cache
                                .filter(channel => (channel.type !== ChannelType.GuildVoice) && channel.type !== ChannelType.GuildCategory).size)
                            .reduce((a, b) => a + b, 0)}**\nVoice channels: **${cache
                            .map(g => g.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size)
                            .reduce((a, b) => a + b, 0)}**`, inline: true,
                    },
                ])
                .withOkColor(message),
            new EmbedBuilder()
                .setDescription("**Built using**:")
                .addFields([
                    {
                        name: "Discord.js library",
                        value: `[Discord.js](https://discord.js.org/#/ 'Discord.js website') v${version}`,
                        inline: true,
                    },
                    {
                        name: "Discord-Akairo framework (Fork by TanzaniteBot)",
                        value: `[Discord-Akairo (forked)](https://github.com/TanzaniteBot/discord-akairo 'github') v${akairoVersion}`,
                        inline: true,
                    },
                    {
                        name: "Running on Node.js",
                        value: `[Node.js](https://nodejs.org/en/ 'Node.js website') ${process.version}`,
                        inline: true,
                    },
                    {
                        name: "Node Package Manager",
                        value: `[npm](https://www.npmjs.com/ 'npm website') \`${process.env.npm_config_user_agent || "N/A"}\``,
                        inline: true,
                    },
                ])
                .setAuthor({
                    name: "© 2022 @Cata#2702",
                    iconURL: message.client.user.displayAvatarURL(),
                    url: packageJSON.repository.url,
                })
                .withOkColor(message),
        ];

        return sendPaginatedMessage(message, pages, {});
    }
}
