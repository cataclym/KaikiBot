import { time } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { Args, EmojiObject } from "@sapphire/framework";
import {
    CategoryChannel,
    ChannelType,
    EmbedBuilder,
    ForumChannel,
    GuildChannel,
    GuildMember,
    Message,
    Role,
    TextChannel,
} from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

// Todo: Add missing arguments
@ApplyOptions<KaikiCommandOptions>({
    name: "info",
    description: "Returns info on a channel, role, member, emoji, or message",
    usage: ["#channel", "@member", "@role", ":coolCustomEmoji:", "messageID"],
    preconditions: ["GuildOnly"],
    typing: true,
    minorCategory: "Info",
})
export default class InfoCommand extends KaikiCommand {
    // constructor() {
    //     super("info", {
    //         aliases: ["info"],
    //         channel: "guild",
    //         description: "Returns info on a channel, role, member, emoji, or message",
    //         usage: ["#channel", "@member", "@role", ":coolCustomEmoji:", "messageID"],
    //         typing: true,
    //         args: [
    //             {
    //                 id: "obj",
    //                 type: Argument.union("member",
    //                     "channel",
    //                     "role",
    //                     "emoji",
    //                     "guildMessage",
    //                     (message, content) => emojis.find(content),
    //                     Constants.emoteRegex,
    //                     (message) => message.stickers,
    //                     (_, _phrase) => _phrase.length <= 0
    //                         ? ""
    //                         : undefined),
    //                 match: "content",
    //                 otherwise: async (m: Message) => ({
    //                     embeds: [await KaikiEmbeds.errorMessage(m, "A channel, user, role, emoji or message was not found. Make sure to provide a valid argument!")],
    //                 }),
    //             },
    //         ],
    //         subCategory: "Info",
    //     });
    // }

    private isEmojiObject(obj: Message<boolean> | GuildMember | Role | EmojiObject): obj is EmojiObject {
        return "id" in obj && "name" in obj && ((obj as EmojiObject).animated || (obj as EmojiObject).animated === null);
    }

    public async messageRun(message: Message<true>, args: Args) {

        const obj = await Promise.resolve(args.pick("member")
            .catch(async () => args.pick("guildChannel"))
            .catch(async () => args.pick("role"))
            .catch(async () => args.pick("emoji"))
            .catch(async () => args.pick("message")));

        // Base embed
        const emb = [
            new EmbedBuilder()
                .withOkColor(message),
        ];

        if (obj instanceof GuildChannel) {

            if (obj.isVoiceBased()) {

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

                if (obj.parent) {
                    emb[0].addFields([
                        {
                            name: "Parent",
                            value: `${obj.parent.name} [${obj.parentId}]`,
                        },
                    ]);
                }
            }

            else if (obj.isThread()) {
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
            }

            else if (obj.isTextBased() || obj instanceof ForumChannel) {

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
                            value: time(obj.createdAt),
                        },
                        {
                            name: "Link",
                            value: obj.url,
                        },
                    );

                if (obj.parent) {
                    emb[0].addFields([
                        {
                            name: "Parent",
                            value: `${obj.parent.name} [${obj.parentId}]`,
                        },
                    ]);
                }
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
                            value: time(obj.createdAt),
                        },
                        {
                            name: "Link",
                            value: obj.url,
                        },
                    ]);


                if (obj.parent) {
                    emb[0].addFields([
                        {
                            name: "Parent",
                            value: `${obj.parent.name} [${obj.parentId}]`,
                        },
                    ]);
                }
            }

            else {
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
                            name: "Created at",
                            value: time(obj.createdAt),
                        },
                        {
                            name: "Link",
                            value: obj.url,
                        },
                    );

                if (obj.parent) {
                    emb[0].addFields([
                        {
                            name: "Parent",
                            value: `${obj.parent.name} [${obj.parentId}]`,
                        },
                    ]);
                }
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

        else if (Utility.isRegex(obj)) {

            const emoji = obj.match[0].toString().split(":");

            // Todo: Fix.
            if (emoji.length < 3) throw new Error("Something happened...");

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
                .setTitle(`Info about default emoji: ${obj.name}`)
                .addFields([
                    {
                        name: "Name", value: obj.name!, inline: true,
                    },
                    {
                        name: "ID", value: obj.id!, inline: true,
                    },
                ]);
        }

        return message.channel.send({ embeds: emb });

    }
}
