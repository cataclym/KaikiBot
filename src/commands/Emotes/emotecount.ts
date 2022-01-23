import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { Snowflake } from "discord-api-types";
import { Guild, Message, MessageEmbed } from "discord.js";
import Utility from "../../lib/Util";
import { getGuildDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "kaiki";


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
            guildDB = await getGuildDocument((message.guild as Guild).id),
            GuildEmoteCount = guildDB.emojiStats,

            baseEmbed = new MessageEmbed()
                .setTitle("Emote count")
                .setAuthor({ name: (message.guild as Guild).name })
                .withOkColor(message),

            emoteDataPair = Object
                .entries(GuildEmoteCount)
                .sort((a, b) => b[1] - a[1]);

        for (const [key, value] of emoteDataPair) {

            const Emote = (message.guild as Guild).emojis.cache.get(key as Snowflake);

            if (!Emote) continue;

            if (!flag) data.push(`\`${value}\` ${Emote} | ${Emote.name}`);
            else data.push(`${Emote} \`${value}\` `);
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
