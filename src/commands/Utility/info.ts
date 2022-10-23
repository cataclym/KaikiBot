import { time } from "@discordjs/builders";
import { Argument } from "discord-akairo";
import {
    BaseChannel,
    CategoryChannel,
    ChannelType,
    EmbedBuilder,
    Emoji,
    ForumChannel,
    GuildBasedChannel,
    GuildMember,
    Message,
    NewsChannel,
    Role,
    StageChannel,
    TextChannel,
    ThreadChannel,
    VoiceChannel,
} from "discord.js";
import * as emojis from "node-emoji";

import { isRegex } from "../../lib/functions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import { regexpType } from "../../lib/Types/TCustom";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

export default class InfoCommand extends KaikiCommand {
    constructor() {
        super("info", {
            aliases: ["info"],
            channel: "guild",
            description: "Returns info on a channel, role, member, emoji, or message",
            usage: ["#channel", "@member", "@role", ":coolCustomEmoji:", "messageID"],
            typing: true,
            args: [
                {
                    id: "obj",
                    type: Argument.union("member", "channel", "role", "emoji", (message, content) => {
                        return emojis.find(content);
                    }, "guildMessage", Constants.EMOTE_REGEX, (_, _phrase) => _phrase.length <= 0
                        ? ""
                        : undefined),
                    match: "content",
                    otherwise: async (m: Message) => ({
                        embeds: [await KaikiEmbeds.errorMessage(m, "A channel, user, role, emoji or message was not found. Make sure to provide a valid argument!")],
                    }),
                },
            ],
            subCategory: "Info",
        });
    }

    public async exec(message: Message<true>, { obj }: { obj: GuildBasedChannel | GuildMember | Role | regexpType | emojis.Emoji | Emoji | Message }): Promise<Message | void> {

        if (!obj) {
            if (!message.member) return;
            obj = message.member;
        }

        const emb = [
            new EmbedBuilder()
                .withOkColor(message),
        ];

        if (obj instanceof BaseChannel) {
            if (obj instanceof VoiceChannel || obj instanceof StageChannel) {
                emb[0]
                    .setTitle(`Info about voice channel: ${obj.name}`)
                    .addFields([
                        {
                            name: "ID",
                            value: obj.id,
                        },
                        {
                            name: "Type",
                            value: Constants.channelTypes[ChannelType[obj.type] as keyof typeof ChannelType],
                        },
                        {
                            name: "User limit",
                            value: obj.userLimit === 0
                                ? "No limit"
                                : String(obj.userLimit),
                        },
                        {
                            name: "Created at",
                            value: String(obj.createdAt),
                        },
                        {
                            name: "Bitrate",
                            value: obj.bitrate / 1000 + "kbps",
                        },
                        {
                            name: "Link",
                            value: obj.url,
                        },
                    ]);

                if (obj.parent) emb[0].addFields([{ name: "Parent", value: `${obj.parent.name} [${obj.parentId}]` }]);
            }

            else if (obj instanceof TextChannel || obj instanceof NewsChannel || obj instanceof ForumChannel) {
                emb[0]
                    .setTitle(`Info about text channel: ${obj.name}`)
                    .addFields(
                        {
                            name: "ID",
                            value: obj.id,
                        },
                        {
                            name: "Type",
                            value: Constants.channelTypes[ChannelType[obj.type] as keyof typeof ChannelType],
                        },
                        {
                            name: "NSFW",
                            value: obj.nsfw ? "Enabled" : "Disabled",
                        },
                        {
                            name: "Created at",
                            value: String(obj.createdAt),
                        },
                        {
                            name: "Link",
                            value: obj.url,
                        },
                    );

                if (obj.parent) emb[0].addFields([{ name: "Parent", value: `${obj.parent.name} [${obj.parentId}]` }]);
            }

            else if (obj instanceof CategoryChannel) {
                emb[0]
                    .setTitle(`Info about category channel: ${obj.name}`)
                    .addFields([
                        {
                            name: "ID", value: obj.id,
                        },
                        {
                            name: "Type",
                            value: Constants.channelTypes[ChannelType[obj.type] as keyof typeof ChannelType],
                        },
                        {
                            name: "Children", value: String(obj.children.cache.size),
                        },
                        {
                            name: "Created at",
                            value: String(obj.createdAt),
                        },
                        {
                            name: "Link",
                            value: obj.url,
                        },
                    ]);


                if (obj.parent) emb[0].addFields([{ name: "Parent", value: `${obj.parent.name} [${obj.parentId}]` }]);
            }

            else if (obj instanceof ThreadChannel) {
                emb[0]
                    .setTitle(`Info about Thread: ${obj.name}`)
                    .addFields([
                        {
                            name: "Type",
                            value: Constants.channelTypes[ChannelType[obj.type] as keyof typeof ChannelType],
                        },
                        {
                            name: "ID",
                            value: obj.id,
                        },
                        {
                            name: "Created at", value: String(obj.createdAt),
                        },
                        {
                            name: "Link",
                            value: obj.url,
                        },
                    ]);

                if (obj.ownerId) {
                    emb[0]
                        .addFields([
                            {
                                name: "Author",
                                value: message.guild.members.cache.get(obj.ownerId)?.user.tag || obj.ownerId,
                            },
                        ]);

                }

                if (obj.parent) emb[0].addFields([{ name: "Parent", value: `${obj.parent.name} [${obj.parentId}]` }]);
            }
        }

        else if (obj instanceof GuildMember) {
            const presence = Utility.getMemberPresence(obj);

            emb[0]
                .setTitle(`Info about user: ${obj.user.tag}`)
                .setDescription(obj.displayName)
                .setThumbnail(obj.user.displayAvatarURL())
                .addFields([
                    { name: "ID", value: obj.id, inline: true },
                    { name: "Joined Server", value: String(obj.joinedAt ? time(obj.joinedAt) : "N/A"), inline: true },
                    { name: "Joined Discord", value: String(time(obj.user.createdAt)), inline: true },
                    { name: "Roles", value: String(obj.roles.cache.size), inline: true },
                    { name: "Highest role", value: String(obj.roles.highest), inline: true },
                ]);

            const uFlags = obj.user.flags?.toArray();

            if (uFlags?.length) {
                emb[0]
                    .addFields([
                        {
                            name: "Flags",
                            value: uFlags.map(flag => Constants.flags[flag]).join("\n"),
                            inline: true,
                        },
                    ]);
            }

            if (obj.user.banner || (await obj.user.fetch(true)).banner) {
                emb[0]
                    .setImage(obj.user.bannerURL({ size: 4096 }) || null);
            }

            if (obj.user.bot) emb[0].addFields({ name: "Bot", value: "✅", inline: true });

            if (presence) {
                emb[1] = new EmbedBuilder()
                    .withOkColor(message);

                emb[1]
                    .addFields({ name: presence.name, value: presence.value });
                if (presence.image) {
                    emb[1]
                        .setThumbnail(presence.image);
                }
            }
        }

        else if (obj instanceof Role) {
            emb[0]
                .setTitle(`Info about role: ${obj.name}`)
                .addFields([
                    {
                        name: "ID",
                        value: obj.id,
                        inline: true,
                    },
                    {
                        name: "Created at",
                        value: String(obj.createdAt),
                        inline: true,
                    },
                    {
                        name: "Color",
                        value: obj.hexColor,
                        inline: true,
                    },
                    {
                        name: "Members",
                        value: String(obj.members.size),
                        inline: true,
                    },
                    {
                        name: "Mentionable",
                        value: String(obj.mentionable),
                        inline: true,
                    },
                    {
                        name: "Hoisted",
                        value: String(obj.hoist),
                        inline: true,
                    },
                    {
                        name: "Position", value: String(obj.position), inline: true,
                    },
                ]);
        }

        else if (obj instanceof Emoji) {
            emb[0]
                .setTitle(`Info about Emoji: ${obj.name} ${obj}`)
                .addFields([
                    {
                        name: "Name", value: obj.name ?? "Null", inline: true,
                    },
                    {
                        name: "ID",
                        value: obj.id ?? "Null",
                        inline: true,
                    },
                    {
                        name: "Created at", value: String(obj.createdAt ?? "Null"),
                    },
                    {
                        name: "Animated",
                        value: obj.animated ? "Yes" : "No",
                        inline: true,
                    },
                ]);


            if (obj.url) {
                emb[0]
                    .setImage(obj.url)
                    .addFields([{ name: "Link", value: obj.url, inline: true }]);
            }
        }

        else if (obj instanceof Message) {
            emb[0]
                .setTitle(`Info about message in channel: ${(obj.channel as TextChannel).name}`)
                .addFields([
                    {
                        name: "ID", value: obj.id, inline: true,
                    },
                    {
                        name: "Created at",
                        value: String(obj.createdAt),
                    },
                    {
                        name: "Author", value: obj.author.tag, inline: true,
                    },
                    {
                        name: "Link",
                        value: obj.url,
                        inline: true,
                    },
                ]);

        }

        else if (isRegex(obj)) {

            const emoji = obj.match[0].toString().split(":");

            if (emoji.length < 3) return message.channel.send({ embeds: [KaikiEmbeds.genericArgumentError(message)] });

            const id = emoji[2].replace(">", "");
            const link = `https://cdn.discordapp.com/emojis/${id}.${emoji[0] === "<a" ? "gif" : "png"}`;

            emb[0]
                .setTitle("Info about custom emoji")
                .setImage(link)
                .addFields([
                    {
                        name: "Name", value: emoji[1], inline: true,
                    },
                    {
                        name: "ID",
                        value: id,
                        inline: true,
                    },
                    {
                        name: "Raw", value: `\`${emoji[0]}:${emoji[1]}:${emoji[2]}\``, inline: true,
                    },
                    {
                        name: "Link",
                        value: link,
                        inline: true,
                    },
                ]);

        }

        else {
            emb[0]
                .setTitle(`Info about default emoji: ${obj.emoji}`)
                .addFields([
                    {
                        name: "Name", value: obj.key, inline: true,
                    },
                    {
                        name: "Raw",
                        value: obj.emoji,
                        inline: true,
                    },
                ]);
        }

        return message.channel.send({ embeds: emb });

    }
}
