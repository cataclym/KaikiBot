import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

const timer = (ms: number) => new Promise(res => setTimeout(res, ms));

@ApplyOptions<KaikiCommandOptions>({
    name: "deleteemote",
    aliases: ["de"],
    description: "Deletes one or multiple emotes/emoji. Multiple emotes take longer, to avoid ratelimits. Keep a space between all emotes you wish to delete.",
    usage: "<:NadekoSip:>",
    requiredUserPermissions: ["ManageEmojisAndStickers"],
    requiredClientPermissions: ["ManageEmojisAndStickers"],
    preconditions: ["GuildOnly"],
    typing: true,
})
export default class DeleteEmoteCommand extends KaikiCommand {

    public async messageRun(message: Message, args: Args): Promise<Message> {

        const emotes = await args.repeat("emoji");

        return (async function() {
            let i = 0;
            for (const emote of emotes) {

                if (!emote.id) continue;

                const emoji = message.guild?.emojis.cache.get(emote.id);

                if (emoji) {

                    i > 0 ? await timer(Constants.MAGIC_NUMBERS.CMDS.EMOTES.DELETE_EMOTE.DELETE_DELAY) && i++ : i++;

                    const deleted = await emoji.delete();

                    if (!deleted) {
                        return message.channel.send({
                            embeds: [
                                new EmbedBuilder({
                                    title: "Error occurred",
                                    description: "Some or all emotes could not be deleted.",
                                })
                                    .withErrorColor(message),
                            ],
                        });
                    }
                }

                else {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder({
                                title: "Error occurred",
                                description: "Not valid emote(s).",
                            })
                                .withErrorColor(message),
                        ],
                    });
                }
            }

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Success!")
                        .setDescription(`Deleted:\n${Utility.trim(emotes.map(e => `:${e.name}: (${e.id})`).join("\n"), Constants.MAGIC_NUMBERS.EMBED_LIMITS.DESCRIPTION)}`)
                        .withOkColor(message),
                ],
            });
        })();
    }
}
