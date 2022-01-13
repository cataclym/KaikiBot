import { Snowflake } from "discord-api-types";
import { Message, MessageEmbed, Permissions } from "discord.js";
import { KaikiCommand } from "kaiki";

import { getGuildDocument } from "../../struct/documentMethods";
import { emoteReactCache } from "../../cache/cache";

export default class RemoveEmoteReactCommand extends KaikiCommand {
    constructor() {
        super("removereact", {
            aliases: ["removereact", "rer"],
            userPermissions: Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS,
            channel: "guild",
            description: "Remove emotereact triggers.",
            usage: ["anime"],
            args: [
                {
                    id: "trigger",
                    type: "string",
                    match: "rest",
                },
            ],
        });
    }

    public async exec(message: Message, { trigger }: { trigger: string }): Promise<Message> {

        const db = await getGuildDocument(message.guild!.id),
            emoji = message.guild?.emojis.cache
                .get(db.emojiReactions[trigger] as Snowflake);

        if (db.emojiReactions[trigger]) {

            if (trigger.includes(" ")) {
                delete emoteReactCache[message.guild!.id].has_space[trigger];
            }

            else {
                delete emoteReactCache[message.guild!.id].no_space[trigger];
            }

            delete db.emojiReactions[trigger];
            db.markModified("emojiReactions");
            await db.save();

            const embed = new MessageEmbed()
                .setTitle("Removed emoji trigger")
                .setDescription(`Saying \`${trigger}\` will no longer force me to react with \`${emoji?.name ?? "missing emote"}\``)
                .withOkColor(message);

            if (emoji) embed.setThumbnail(emoji.url);

            return message.channel.send({ embeds: [embed] });
        }

        else {
            await db.save();
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle("Not found")
                    .setDescription("Trigger not found in the database")
                    .withErrorColor(message)],
            });
        }
    }
}
