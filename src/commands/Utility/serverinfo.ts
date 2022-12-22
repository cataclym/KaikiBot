import { time } from "@discordjs/builders";
import { ChannelType, EmbedBuilder, Guild, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import Constants from "../../struct/Constants";

export default class ServerInfoCommand extends KaikiCommand {
    constructor() {
        super("serverinfo", {
            aliases: ["serverinfo", "sinfo"],
            description: "Shows information about the current server.",
            args: [
                {
                    id: "guild",
                    type: "guild",
                    default: (message: Message) => message.guild,
                },
            ],
            subCategory: "Info",
        });
    }

    public async exec(message: Message, { guild }: { guild: Guild }): Promise<Message> {

        const emb = new EmbedBuilder({
            thumbnail: { url: <string>guild?.iconURL({ extension: "png", size: 2048 }) },
            title: `${guild.name} [${guild.id}]`,
            author: { name: "Server info" },
            fields: [
                {
                    name: "Owner",
                    value: message.client.users.cache.get(guild.ownerId)?.tag ?? guild.ownerId,
                    inline: true,
                },
                { name: "Created At", value: time(guild.createdAt), inline: true },
                { name: "Members", value: String(guild.memberCount), inline: true },
                { name: "Roles", value: String(guild.roles.cache.size), inline: true },
                { name: "Emotes", value: String(guild.emojis.cache.size), inline: true },
                { name: "MFA level", value: String(guild.mfaLevel), inline: true },
                {
                    name: "Channels",
                    value: `Text: **${guild?.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size}**
Voice: **${guild?.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size}**
News: **${guild?.channels.cache.filter((channel) => channel.type === ChannelType.GuildNews).size}**`,
                    inline: true,
                },
                { name: "Maximum video-channel users", value: String(guild.maxVideoChannelUsers), inline: false },
                {
                    name: "Features", value: guild?.features.length
                        ? guild?.features.map(f => Constants.guildFeatures[f] || f).sort().join("\n")
                        : "None", inline: false,
                },
            ],
        });

        return message.channel.send({ embeds: [emb.withOkColor(message)] });
    }
}
