import querystring from "querystring";
import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message } from "discord.js";

import { UrbanResponse } from "../../lib/Interfaces/Common/UrbanResponse";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "urbandict",
    aliases: ["urban", "ud"],
    description: "Searches Urban Dictionary for a word or sentence",
    usage: ["Watermelon", "anime"],
})
export default class UrbanDictCommand extends KaikiCommand {
    public async messageRun(
        message: Message,
        args: Args
    ): Promise<Message | void> {
        const query = querystring.stringify({
            term: await args.rest("string"),
        });

        const list = await KaikiUtil.json<UrbanResponse[]>(
            KaikiUtil.checkResponse(
                await fetch(
                    `https://api.urbandictionary.com/v0/define?${query}`
                )
            ),
            "list"
        );

        if (!list.length) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder({
                        description: `No results found for **${query}**.`,
                    }).withErrorColor(message),
                ],
            });
        }

        const pages: EmbedBuilder[] = [];

        for (const result of list) {
            pages.push(
                new EmbedBuilder()
                    .setTitle(result.word)
                    .setURL(result.permalink)
                    .addFields(
                        {
                            name: "Definition",
                            value: KaikiUtil.trim(
                                result.definition,
                                Constants.MAGIC_NUMBERS.EMBED_LIMITS.FIELD.VALUE
                            ),
                        },
                        {
                            name: "Example",
                            value: KaikiUtil.trim(
                                result.example || "N/A",
                                Constants.MAGIC_NUMBERS.EMBED_LIMITS.FIELD.VALUE
                            ),
                        },
                        {
                            name: "Rating",
                            value: `${result.thumbs_up} thumbs up. ${result.thumbs_down} thumbs down.`,
                        }
                    )
                    .withOkColor(message)
            );
        }

        return sendPaginatedMessage(message, pages, {});
    }
}
