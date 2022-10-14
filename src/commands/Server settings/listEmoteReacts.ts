import { PrefixSupplier } from "discord-akairo";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { Message, EmbedBuilder } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class RemoveEmoteReactCommand extends KaikiCommand {
    constructor() {
        super("listreacts", {
            aliases: ["listreacts", "ler"],
            channel: "guild",
            description: "List emotereact triggers.",
            usage: [""],
        });
    }

    public async exec(message: Message<true>): Promise<Message> {

        const db = await this.client.orm.emojiReactions.findMany({ where: { GuildId: BigInt(message.guildId) } }),
            pages: EmbedBuilder[] = [];

        if (!db.length) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setTitle("No triggers")
                    .setDescription(`Add triggers with ${(this.handler.prefix as PrefixSupplier)(message)}aer`)
                    .withErrorColor(message)],
            });
        }

        for (let index = 15, p = 0; p < db.length; index += 15, p += 15) {

            pages.push(new EmbedBuilder()
                .setTitle("Emoji triggers")
                .setDescription(db.slice(p, index).map(table => {
                    return `**${table.TriggerString}** => ${message.guild?.emojis.cache.get(String(table.EmojiId)) ?? table.EmojiId}`;
                }).join("\n"))
                .withOkColor(message));
        }

        return sendPaginatedMessage(message, pages, {});
    }
}
