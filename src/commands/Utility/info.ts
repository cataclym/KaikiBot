import { time } from "@discordjs/builders";
import { Argument } from "discord-akairo";
import {
    BaseChannel,
    BaseGuildTextChannel,
    CategoryChannel,
    ChannelType,
    Collection,
    EmbedBuilder,
    Emoji,
    ForumChannel,
    GuildBasedChannel,
    GuildMember,
    Message,
    Role,
    StageChannel,
    Sticker,
    TextChannel,
    VoiceChannel,
} from "discord.js";
import * as emojis from "node-emoji";

import { isRegex } from "../../lib/functions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import { RegexpType } from "../../lib/Types/TCustom";
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
                    type: Argument.union("member",
                        "channel",
                        "role",
                        "emoji",
                        "guildMessage",
                        (message, content) => emojis.find(content),
                        Constants.EMOTE_REGEX,
                        (message) => message.stickers,
                        (_, _phrase) => _phrase.length <= 0
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

    public async exec(message: Message<true>, { obj }: { obj: GuildBasedChannel | GuildMember | Role | RegexpType | Collection<string, Sticker> | emojis.Emoji | Emoji | Message }): Promise<Message | void> {

        if (!obj) {
            if (!message.member) return;
            obj = message.member;
        }

        else if (obj instanceof Map && !obj.size) {
            return message.channel.send({
                embeds: [await KaikiEmbeds.errorMessage(message, "A channel, user, role, emoji or message was not found. Make sure to provide a valid argument!")],
            });
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
                            value: Constants.ChannelTypes[ChannelType[obj.type] as keyof typeof ChannelType],
                        },
                        {
                            name: "User limit",
                            value: obj.userLimit === 0
                                ? "No limit"
                                : String(obj.userLimit),
                        },
                        {
                            name: "Created at",
                            value: time(obj.createdAt),
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

            else if (obj instanceof BaseGuildTextChannel || obj instanceof ForumChannel) {
                emb[0]
                    .setTitle(`Info about text channel: ${obj.name}`)
                    .addFields(
                        {
                            name: "ID",
                            value: obj.id,
                        },
                        {
                            name: "Type",
                            value: Constants.ChannelTypes[ChannelType[obj.type] as keyof typeof ChannelType],
                        },
                        {
                            name: "NSFW",
                            value: obj.nsfw ? "Enabled" : "Disabled",
                        },
                        {
                            name: "Created at",
                            value: time(obj.createdAt),
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
                            value: Constants.ChannelTypes[ChannelType[obj.type] as keyof typeof ChannelType],
                        },
                        {
                            name: "Children", value: String(obj.children.cache.size),
                        },
                        {
                            name: "Created at",
                            value: time(obj.createdAt),
                        },
                        {
                            name: "Link",
                            value: obj.url,
                        },
                    ]);


                if (obj.parent) emb[0].addFields([{ name: "Parent", value: `${obj.parent.name} [${obj.parentId}]` }]);
            }

            else {
                emb[0]
                    .setTitle(`Info about Thread: ${obj.name}`)
                    .addFields([
                        {
                            name: "Type",
                            value: Constants.ChannelTypes[ChannelType[obj.type] as keyof typeof ChannelType],
                        },
                        {
                            name: "ID",
                            value: obj.id,
                        },
                        {
                            name: "Created at",
                            value: obj.createdAt
                                ? time(obj.createdAt)
                                : "N/A",
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
                .setThumbnail(obj.user.displayAvatarURL())
                .addFields([
                    { name: "ID", value: obj.id, inline: true },
                    {
                        name: "Joined Server",
                        value: obj.joinedAt
                            ? time(obj.joinedAt)
                            : "N/A", inline: true,
                    },
                    { name: "Joined Discord", value: time(obj.user.createdAt), inline: true },
                    { name: "Roles", value: String(obj.roles.cache.size), inline: true },
                    { name: "Highest role", value: String(obj.roles.highest), inline: true },
                ]);

            const uFlags = obj.user.flags?.toArray();

            if (uFlags?.length) {
                emb[0]
                    .addFields([
                        {
                            name: "Flags",
                            value: uFlags.map(flag => Constants.Flags[flag]).join("\n"),
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
                        value: time(obj.createdAt),
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
                        name: "Name",
                        value: obj.name ?? "Null",
                        inline: true,
                    },
                    {
                        name: "ID",
                        value: obj.id ?? "Null",
                        inline: true,
                    },
                    {
                        name: "Created at",
                        value: obj.createdAt
                            ? time(obj.createdAt)
                            : "N/A",
                    },
                    {
                        name: "Animated",
                        value: obj.animated
                            ? "Yes"
                            : "No",
                        inline: true,
                    },
                ]);


            if (obj.url) {
                emb[0]
                    .setImage(obj.url)
                    .addFields([{ name: "Link", value: obj.url, inline: true }]);
            }
        }

        else if (obj instanceof Collection) {
            let i = 0;
            obj.forEach(sticker => emb[i++] = new EmbedBuilder()
                .setTitle(`Info about Sticker: ${sticker.name}`)
                .setImage(sticker.url)
                .addFields({
                    name: "ID",
                    value: sticker.id,
                    inline: true,

                },
                {
                    name: "Tags",
                    value: sticker.tags || "N/A",
                    inline: true,
                },
                {
                    name: "Description",
                    value: sticker.description || "N/A",
                    inline: true,
                },
                {
                    name: "Type",
                    value: sticker.type === 1
                        ? "Official"
                        : "Guild" || "N/A",
                    inline: true,
                })
                .withOkColor(message),
            );
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
                        value: time(obj.createdAt),
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
