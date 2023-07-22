import { time } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { Args, EmojiObject, UserError } from "@sapphire/framework";
import {
    CategoryChannel,
    ChannelType,
    Collection,
    EmbedBuilder,
    GuildChannel,
    GuildMember,
    Message,
    Role,
    Sticker,
    TextChannel,
    ThreadChannel,
    User,
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

    // Custom arguments
    // private static stickers = Args.make<Collection<string, Sticker>>((parameter: string, context: ArgumentContext<Collection<string, Sticker>>) => {
    //
    //     if (context.message.stickers.size) return Args.ok(context.message.stickers);
    //
    //     return Args.error({
    //         parameter,
    //         context,
    //         argument: context.argument,
    //     });
    // });

    public async messageRun(message: Message<true>, args: Args) {


        const obj = args.finished
            ? message.member || message.author
            : await Promise.resolve(args.pick("member")
                .catch(async () => args.pick("user"))
                .catch(async () => args.pick("guildChannel"))
                .catch(async () => args.pick("role"))
                .catch(async () => args.pick("emoji"))
                .catch(async () => args.pick("message")));

        let emb: EmbedBuilder[] = [];

        if (obj instanceof GuildChannel || obj instanceof ThreadChannel) {
            emb = await this.gChannel(message, obj);
        }

        else if (obj instanceof GuildMember || obj instanceof User) {
            emb = await this.gMember(message, obj);
        }

        else if (obj instanceof Role) {
            emb = await this.gRole(message, obj);
        }

        else if (obj instanceof Message) {
            emb = await this.gMessage(message, obj);
        }

        else if (obj instanceof Collection) {
            emb = await this.sticker(message, obj);
        }

        else {
            emb = await this.emoji(message, obj);
        }

        return message.channel.send({ embeds: emb });
    }

    private async gMember(message: Message<true>, obj: GuildMember | User) {

        // Base embed
        const emb = [
            new EmbedBuilder()
                .withOkColor(message),
        ];

        const isMember = "user" in obj;

        const user = isMember
            ? obj.user
            : obj;

        emb[0]
            .setTitle(`Info about user: ${user.username}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields([
                { name: "ID", value: obj.id, inline: true },
                { name: "Joined Discord", value: time(user.createdAt), inline: true },
            ]);

        const uFlags = user.flags?.toArray();

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

        if (user.bot) emb[0].addFields({ name: "Bot", value: "✅", inline: true });

        if (user.banner || (await user.fetch(true)).banner) {
            emb[0]
                .setImage(user.bannerURL({ size: 4096 }) || null);
        }

        if (isMember) {
            const presence = Utility.getMemberPresence(obj);

            emb[0]
                .addFields({
                    name: "Joined Server",
                    value: obj.joinedAt
                        ? time(obj.joinedAt)
                        : "N/A", inline: true,
                },
                { name: "Roles", value: String(obj.roles.cache.size), inline: true },
                { name: "Highest role", value: String(obj.roles.highest), inline: true });

            if (presence) {
                emb[1] = new EmbedBuilder()
                    .withOkColor(message)
                    .setTitle(presence.type)
                    .setDescription([presence.name, presence.state, presence.value.large, presence.value.small, presence.value.details]
                        .filter(Boolean)
                        .join("\n"));

                if (presence.image) {
                    emb[1]
                        .setImage(presence.image);
                }

                if (presence.emoji) {
                    emb[1]
                        .setThumbnail(presence.emoji);
                }
            }
        }

        return emb;
    }

    private async gChannel(message: Message<true>, obj: GuildChannel | ThreadChannel) {

        // Base embed
        const emb = [
            new EmbedBuilder()
                .withOkColor(message),
        ];

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

        else if (obj.isTextBased()) {

            if (obj.isThread()) {
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
                                value: message.guild.members.cache.get(obj.ownerId)?.user.username || obj.ownerId,
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
        }

        // Generic GuildChannel. Probably unnecessary, however it is required for the interpreter...
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
                        value: obj.createdAt
                            ? time(obj.createdAt)
                            : "N/A",
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

        return emb;
    }

    private async gRole(message: Message<true>, obj: Role) {

        // Base embed
        const emb = [
            new EmbedBuilder()
                .withOkColor(message),
        ];

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

        return emb;
    }

    private async gMessage(message: Message<true>, obj: Message<boolean>) {

        // Base embed
        const emb = [
            new EmbedBuilder()
                .withOkColor(message),
        ];

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
                    name: "Author", value: obj.author.username, inline: true,
                },
                {
                    name: "Link",
                    value: obj.url,
                    inline: true,
                },
            ]);

        return emb;
    }

    private async emoji(message: Message<true>, obj: EmojiObject) {

        // Base embed
        const emb = [
            new EmbedBuilder()
                .withOkColor(message),
        ];

        if (!obj.id) {
            // Todo: It should return ArgumentError sometime
            throw new UserError({
                identifier: "DefaultEmoji",
                message: "The given argument is a default emoji.",
            });
        }

        const id = obj.id;
        const link = `https://cdn.discordapp.com/emojis/${id}.${obj.animated ? "gif" : "png"}`;

        emb[0]
            .setTitle("Info about custom emoji")
            .setImage(link)
            .addFields([
                {
                    name: "Name", value: obj.name || "N/A", inline: true,
                },
                {
                    name: "ID",
                    value: id || "N/A",
                    inline: true,
                },
                {
                    name: "Raw", value: `\`:${obj.name}:\``, inline: true,
                },
                {
                    name: "Link",
                    value: link,
                    inline: true,
                },
            ]);

        return emb;
    }

    private async sticker(message: Message<true>, obj: Collection<string, Sticker>) {

        const emb: EmbedBuilder[] = [];

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

        return emb;
    }
}
