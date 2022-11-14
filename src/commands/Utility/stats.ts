import { execSync } from "child_process";

import { version as akairoVersion } from "discord-akairo";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { ChannelType, EmbedBuilder, Message, version } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

function format(seconds: number) {
    const days = Math.floor(seconds / (60 * 60 * 24));
    seconds %= (60 * 60 * 24);
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60);
    const minutes = Math.floor(seconds / 60);
    return days + "** days**\n" + hours + "** hours**\n" + minutes + "** minutes**";
}

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
                    iconURL: message.client.user?.displayAvatarURL(),
                    url: packageJSON.repository.url,
                })
                .setDescription("Detailed statistics")
                .addFields([
                    {
                        name: "Memory Usage",
                        value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
                        inline: true,
                    },
                    { name: "Uptime", value: String(format(process.uptime())), inline: true },
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
                        name: "Discord-Akairo framework",
                        value: `[Discord-Akairo](https://discord-akairo.github.io/#/ 'Discord-Akairo website') v${akairoVersion}`,
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
                    iconURL: message.client.user?.displayAvatarURL(),
                    url: packageJSON.repository.url,
                })
                .withOkColor(message),
        ];

        return sendPaginatedMessage(message, pages, {});
    }
}
