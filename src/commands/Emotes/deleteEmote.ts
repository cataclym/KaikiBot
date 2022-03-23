import { Collection, GuildEmoji, Message, MessageEmbed, Permissions } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";


const timer = (ms: number) => new Promise(res => setTimeout(res, ms));

export default class DeleteEmoteCommand extends KaikiCommand {
    constructor() {
        super("deleteemote", {
            aliases: ["deleteemote", "de"],
            description: "Deletes one or multiple emotes/emoji. Multiple emotes take longer, to avoid ratelimits. Keep a space between all emotes you wish to delete.",
            usage: "<:NadekoSip:>",
            clientPermissions: Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS,
            userPermissions: Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS,
            channel: "guild",
            typing: true,
            args: [{
                id: "emotes",
                match: "separate",
                type: "emojis",
                otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
            }],
        });
    }

    public async exec(message: Message, { emotes }: { emotes: Collection<string, GuildEmoji>[] }): Promise<Message> {

        return (async function() {
            let i = 0;
            for (const emote of emotes) {

                const newEmote = message.guild?.emojis.cache.get(emote.map(e => e.id)[0]);

                if (newEmote) {

                    i > 0 ? await timer(3500) && i++ : i++;

                    const deleted = await newEmote.delete();

                    if (!deleted) {
                        return message.channel.send({
                            embeds: [new MessageEmbed({
                                title: "Error occurred",
                                description: "Some or all emotes could not be deleted.",
                            })
                                .withErrorColor(message)],
                        });
                    }
                }
                else {
                    return message.channel.send({
                        embeds: [new MessageEmbed({
                            title: "Error occurred",
                            description: "Not valid emote(s).",
                        })
                            .withErrorColor(message)],
                    });
                }
            }

            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle("Success!")
                    .setDescription(`Deleted:\n${Utility.trim(emotes.map((es) => es.map((e) => e)).join("\n"), 2048)}`)
                    .withOkColor(message)],
            });
        })();
    }
}
