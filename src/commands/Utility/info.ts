import { time } from "@discordjs/builders";
import { Argument } from "discord-akairo";
import {
    CategoryChannel,
    Channel,
    Emoji,
    GuildMember,
    Message,
    MessageEmbed,
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

    public async exec(message: Message<true>, { obj }: { obj: Channel | GuildMember | Role | regexpType | emojis.Emoji | Emoji | Message }): Promise<Message | void> {

        if (!obj) obj = message.member!;

        const emb = new MessageEmbed()
            .withOkColor(message);

        if (obj instanceof Channel) {

            if (obj instanceof VoiceChannel || obj instanceof StageChannel) {
                emb.setTitle(`Info about voice channel: ${obj.name}`)
                    .addField("ID", obj.id)
                    .addField("Type", Constants.channelTypes[obj.type])
                    .addField("User limit", obj.userLimit === 0
                        ? "No limit"
                        : String(obj.userLimit))
                    .addField("Created at", String(obj.createdAt))
                    .addField("Bitrate", obj.bitrate / 1000 + "kbps");

                if (obj.parent) emb.addField("Parent", `${obj.parent.name} [${obj.parentId}]`);
            }

            else if (obj instanceof TextChannel || obj instanceof NewsChannel) {
                emb.setTitle(`Info about text channel: ${obj.name}`)
                    .addField("ID", obj.id)
                    .addField("Type", Constants.channelTypes[obj.type])
                    .addField("NSFW", obj.nsfw ? "Enabled" : "Disabled")
                    .addField("Created at", String(obj.createdAt));

                if (obj.parent) emb.addField("Parent", `${obj.parent.name} [${obj.parentId}]`);
            }

            else if (obj instanceof CategoryChannel) {
                emb.setTitle(`Info about category channel: ${obj.name}`)
                    .addField("ID", obj.id)
                    .addField("Type", Constants.channelTypes[obj.type])
                    .addField("Children", String(obj.children.size))
                    .addField("Created at", String(obj.createdAt));

                if (obj.parent) emb.addField("Parent", `${obj.parent.name} [${obj.parentId}]`);
            }

            else if (obj instanceof ThreadChannel) {
                emb.setTitle(`Info about Thread: ${obj.name}`)
                    .addField("Type", Constants.channelTypes[obj.type])
                    .addField("ID", obj.id)
                    .addField("Created at", String(obj.createdAt));

                if (obj.ownerId) {
                    emb.addField("Author", message.guild.members.cache.get(obj.ownerId)?.user.username ?? obj.ownerId);
                }

                if (obj.parent) emb.addField("Parent", `${obj.parent.name} [${obj.parentId}]`);
            }
        }

        else if (obj instanceof GuildMember) {
            const presence = Utility.getMemberPresence(obj);

            emb.setTitle(`Info about user: ${obj.user.tag}`)
                .setDescription(obj.displayName)
                .setThumbnail(obj.user.displayAvatarURL({ dynamic: true }))
                .addField("ID", obj.id, true)
                .addField("Joined Server", String(obj.joinedAt ? time(obj.joinedAt) : "N/A"), true)
                .addField("Joined Discord", String(time(obj.user.createdAt)), true)
                .addField("Roles", String(obj.roles.cache.size), true)
                .addField("Highest role", String(obj.roles.highest), true);

            const uFlags = obj.user.flags?.toArray();

            if (uFlags?.length) {
                emb.addField("Flags", uFlags.map(flag => Utility.flags[flag]).join("\n"), true);
            }

            if (obj.user.banner || (await obj.user.fetch(true)).banner) {
                emb.setImage(obj.user.bannerURL({ dynamic: true, size: 4096 })!);
            }

            if (obj.user.bot) emb.addField("Bot", "✅", true);

            if (presence) {
                emb.addField(presence.name, presence.value);
                if (presence.image) {
                    emb.setImage(presence.image);
                }
            }
        }

        else if (obj instanceof Role) {
            emb.setTitle(`Info about role: ${obj.name}`)
                .addField("ID", obj.id, true)
                .addField("Created at", String(obj.createdAt), true)
                .addField("Color", obj.hexColor, true)
                .addField("Members", String(obj.members.size), true)
                .addField("Mentionable", String(obj.mentionable), true)
                .addField("Hoisted", String(obj.hoist), true)
                .addField("Position", String(obj.position), true);
        }

        else if (obj instanceof Emoji) {
            emb.setTitle(`Info about Emoji: ${obj.name} ${obj}`)
                .addField("Name", obj.name ?? "Null", true)
                .addField("ID", obj.id ?? "Null", true)
                .addField("Created at", String(obj.createdAt ?? "Null"), true)
                .addField("Animated", obj.animated ? "Yes" : "No", true);

            if (obj.url) {
                emb.setImage(obj.url)
                    .addField("Link", obj.url, true);
            }
        }

        else if (obj instanceof Message) {
            emb.setTitle(`Info about message in channel: ${(obj.channel as TextChannel).name}`)
                .addField("ID", obj.id, true)
                .addField("Created at", String(obj.createdAt), true)
                .addField("Author", obj.author.tag, true)
                .addField("Link", obj.url, true);
        }

        else if (isRegex(obj)) {

            const emoji = obj.match[0].toString().split(":");

            if (emoji.length < 3) return message.channel.send({ embeds: [KaikiEmbeds.genericArgumentError(message)] });

            const id = emoji[2].replace(">", "");
            const link = `https://cdn.discordapp.com/emojis/${id}.${emoji[0] === "<a" ? "gif" : "png"}`;

            emb.setTitle("Info about custom emoji")
                .setImage(link)
                .addField("Name", emoji[1], true)
                .addField("ID", id, true)
                .addField("Raw", `\`${emoji[0]}:${emoji[1]}:${emoji[2]}\``, true)
                .addField("Link", link, true);
        }

        else {
            emb.setTitle(`Info about default emoji: ${obj.emoji}`)
                .addField("Name", obj.key, true)
                .addField("Raw", obj.emoji, true);
        }

        return message.channel.send({ embeds: [emb] });

    }
}
