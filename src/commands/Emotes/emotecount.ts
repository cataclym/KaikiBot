import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { Guild, Message, MessageEmbed } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import Utility from "../../lib/Utility";

export default class EmoteCount extends KaikiCommand {
    constructor() {
        super("emotecount", {
            cooldown: 15000,
            aliases: ["emotecount", "emojicount", "ec"],
            description: "Shows amount of times each emote has been used",
            usage: ["", "-s", "--small"],
            channel: "guild",
            args: [{
                id: "flag",
                flag: ["--small", "-s"],
                match: "flag",
            }],
        });
    }

    public async exec(message: Message, { flag }: { flag: boolean }): Promise<Message | void> {

        const data: string[] = [],
            pages: MessageEmbed[] = [],
            guildDB = await this.client.orm.guilds.findUnique({
                where: {
                    Id: BigInt(message.guildId!),
                },
                select: {
                    EmojiStats: true,
                },
            });

        const baseEmbed = new MessageEmbed()
                .setTitle("Emote count")
                .setAuthor({ name: (message.guild as Guild).name })
                .withOkColor(message),

            emoteDataPair = guildDB!.EmojiStats
                .sort((a, b) => Number(b.Count) - Number(a.Count));

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
            for (let i = 25, p = 0; p < data.length; i += 25, p += 25) {

                pages.push(new MessageEmbed(baseEmbed)
                    .setDescription(Utility.trim(data.slice(p, i).join("\n"), 2048)),
                );
            }
        }

        else {
            for (let i = 50, p = 0; p < data.length; i += 50, p += 50) {

                pages.push(new MessageEmbed(baseEmbed)
                    .setDescription(Utility.trim(data.slice(p, i).join(""), 2048)),
                );
            }
        }
        return sendPaginatedMessage(message, pages, {});
    }
}
