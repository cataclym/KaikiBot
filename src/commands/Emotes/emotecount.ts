import { ApplyOptions } from "@sapphire/decorators";
import { Args, UserError } from "@sapphire/framework";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "emotecount",
    aliases: ["emojicount", "ec"],
    description: "Shows amount of times each emote has been used.\nUse --small for a more compact display.\nUse --clean to display *only* available emotes.",
    usage: ["", "--small", "--clean"],
    preconditions: ["GuildOnly"],
    flags: ["small", "clean"],
    cooldownDelay: 15000,
})
export default class EmoteCount extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args): Promise<Message | void> {

        if (!message.guild.emojis.cache.size) {
            throw new UserError({
                identifier: "NoGuildEmojis",
                message: "There are no emojis in this server.",
            });
        }

        const isSmall = args.getFlags("small");
        const isClean = args.getFlags("clean");

        const pages: EmbedBuilder[] = [];
        let guildDB = await this.client.orm.guilds.findUnique({
            where: {
                Id: BigInt(message.guildId),
            },
            select: {
                EmojiStats: true,
            },
        });

        if (!guildDB) {
            await this.client.db.getOrCreateGuild(BigInt(message.guildId));
            guildDB = { EmojiStats: [] };
        }

        const baseEmbed = new EmbedBuilder()
            .setTitle("Emote count")
            .setAuthor({ name: message.guild.name })
            .withOkColor(message);

        const mappedEmotesFromDb = message.guild.emojis.cache.map(guildEmoji => {
            const emoteData = guildDB?.EmojiStats.find(e => String(e.EmojiId) === guildEmoji.id);
            return Object.assign(guildEmoji, emoteData || { Count: 0 });
        })
            .filter(ge => {
                if (isClean) return ge.available;
                return true;
            })
            .sort(({ Count: b }, { Count: a }) => (a < b) ? -1 : ((a > b) ? 1 : 0));

        // Throw error when there are no mapped emotes. This can happen when user uses --clean. Rare case.
        if (!mappedEmotesFromDb.length) throw new UserError({
            identifier: "NoAvailableEmotes",
            message: "There are no available emotes in this server!"
        })

        const data = mappedEmotesFromDb
            .map(guildEmoji => {

                const emote = guildEmoji.available ? guildEmoji : "`Unavailable`";

                if (isSmall) {
                    return `${emote} \`${guildEmoji.Count || 0}\` `;
                }

                return `\`${guildEmoji.Count || 0}\` ${emote} | ${guildEmoji.name}`;
            });

        if (isSmall) {
            for (let i = Constants.MAGIC_NUMBERS.CMDS.EMOTES.EMOTE_COUNT.MAX_PR_PAGE, p = 0;
                p < data.length;
                i += Constants.MAGIC_NUMBERS.CMDS.EMOTES.EMOTE_COUNT.MAX_PR_PAGE, p += Constants.MAGIC_NUMBERS.CMDS.EMOTES.EMOTE_COUNT.MAX_PR_PAGE) {

                pages.push(EmbedBuilder.from(baseEmbed)
                    .setDescription(KaikiUtil.trim(data.slice(p, i).join(""), Constants.MAGIC_NUMBERS.EMBED_LIMITS.DESCRIPTION)),
                );
            }
        }

        else {
            for (let i = Constants.MAGIC_NUMBERS.CMDS.EMOTES.EMOTE_COUNT.MIN_PR_PAGE, p = 0;
                p < data.length;
                i += Constants.MAGIC_NUMBERS.CMDS.EMOTES.EMOTE_COUNT.MIN_PR_PAGE, p += Constants.MAGIC_NUMBERS.CMDS.EMOTES.EMOTE_COUNT.MIN_PR_PAGE) {

                pages.push(EmbedBuilder.from(baseEmbed)
                    .setDescription(KaikiUtil.trim(data.slice(p, i).join("\n"), Constants.MAGIC_NUMBERS.EMBED_LIMITS.DESCRIPTION)),
                );
            }
        }

        return sendPaginatedMessage(message, pages, {});
    }
}
