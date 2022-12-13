import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Guild, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

export default class EmoteCount extends KaikiCommand {
    constructor() {
        super("emotecount", {
            cooldown: 15000,
            aliases: ["emotecount", "emojicount", "ec"],
            description: "Shows amount of times each emote has been used",
            usage: ["", "-s", "--small"],
            channel: "guild",
            args: [
                {
                    id: "flag",
                    flag: ["--small", "-s"],
                    match: "flag",
                },
            ],
        });
    }

    public async exec(message: Message<true>, { flag }: { flag: boolean }): Promise<Message | void> {

        const data: string[] = [];
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
                .withOkColor(message),

            emoteDataPair = guildDB?.EmojiStats
                .sort((a, b) => Number(b.Count) - Number(a.Count)) || [];

        for (const { EmojiId, Count } of emoteDataPair) {

            const Emote = (message.guild as Guild).emojis.cache.get(String(EmojiId));

            if (!Emote) continue;

            if (!flag) {
                data.push(`\`${Count}\` ${Emote} | ${Emote.name}`);
            }

            else {
                data.push(`${Emote} \`${Count}\` `);
            }
        }

        if (!flag) {
            for (let i = Constants.MAGIC_NUMBERS.CMDS.EMOTES.EMOTE_COUNT.MIN_PR_PAGE, p = 0;
                p < data.length;
                i += Constants.MAGIC_NUMBERS.CMDS.EMOTES.EMOTE_COUNT.MIN_PR_PAGE, p += Constants.MAGIC_NUMBERS.CMDS.EMOTES.EMOTE_COUNT.MIN_PR_PAGE) {

                pages.push(new EmbedBuilder(baseEmbed.data)
                    .setDescription(Utility.trim(data.slice(p, i).join("\n"), Constants.MAGIC_NUMBERS.EMBED_LIMITS.DESCRIPTION)),
                );
            }
        }

        else {
            for (let i = Constants.MAGIC_NUMBERS.CMDS.EMOTES.EMOTE_COUNT.MAX_PR_PAGE, p = 0;
                p < data.length;
                i += Constants.MAGIC_NUMBERS.CMDS.EMOTES.EMOTE_COUNT.MAX_PR_PAGE, p += Constants.MAGIC_NUMBERS.CMDS.EMOTES.EMOTE_COUNT.MAX_PR_PAGE) {

                pages.push(new EmbedBuilder(baseEmbed.data)
                    .setDescription(Utility.trim(data.slice(p, i).join(""), Constants.MAGIC_NUMBERS.EMBED_LIMITS.DESCRIPTION)),
                );
            }
        }

        return sendPaginatedMessage(message, pages, {});
    }
}
