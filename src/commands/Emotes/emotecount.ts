import { ApplyOptions } from "@sapphire/decorators";
import { Args, UserError } from "@sapphire/framework";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Guild, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "emotecount",
    aliases: ["emojicount", "ec"],
    description: "Shows amount of times each emote has been used",
    usage: ["", "--s", "--small"],
    preconditions: ["GuildOnly"],
    flags: ["s", "small"],
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

        const isSmall = args.getFlags("s", "small");

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
            .setAuthor({ name: (message.guild as Guild).name })
            .withOkColor(message);

        const map = message.guild.emojis.cache.map(guildEmoji => {
            const emoteData = guildDB?.EmojiStats.find(e => String(e.EmojiId) === guildEmoji.id);
            return Object.assign(guildEmoji, emoteData || { Count: 0 });
        })
            .sort(({ Count: b }, { Count: a }) => (a < b) ? -1 : ((a > b) ? 1 : 0));


        const data = map
            .map(guildEmoji => {

                if (isSmall) {
                    return `${guildEmoji} \`${guildEmoji.Count || 0}\` `;
                }

                return `\`${guildEmoji.Count || 0}\` ${guildEmoji} | ${guildEmoji.name}`;
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
