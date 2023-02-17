import querystring from "querystring";
import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { EmbedBuilder, Message } from "discord.js";
import fetch from "node-fetch";
import { UrbanResponse } from "../../lib/Interfaces/UrbanResponse";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/Kaiki/KaikiUtil";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

export default class UrbanDictCommand extends KaikiCommand {
    constructor() {
        super("urbandict", {
            aliases: ["urbandict", "urban", "ud"],
            description: "Searches Urban Dictionary for a word or sentence",
            usage: ["Watermelon", "anime"],
            args: [
                {
                    id: "term",
                    match: "rest",
                    otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
                },
            ],
        });
    }

    public async exec(message: Message, { term }: { term: string }): Promise<Message | void> {

        const query = querystring.stringify({ term: term });

        const { list }: { list: UrbanResponse[] } = (await KaikiUtil.handleToJSON(await (await fetch(`https://api.urbandictionary.com/v0/define?${query}`)).json()));

        if (!list.length) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder({
                        description: `No results found for **${term}**.`,
                    })
                        .withErrorColor(message),
                ],
            });
        }

        const pages: EmbedBuilder[] = [];

        for (const result of list) {
            pages.push(new EmbedBuilder()
                .setTitle(result.word)
                .setURL(result.permalink)
                .addFields(
                    {
                        name: "Definition",
                        value: Utility.trim(result.definition, Constants.MAGIC_NUMBERS.EMBED_LIMITS.FIELD.VALUE),
                    },
                    {
                        name: "Example",
                        value: Utility.trim(result.example || "N/A", Constants.MAGIC_NUMBERS.EMBED_LIMITS.FIELD.VALUE),
                    },
                    {
                        name: "Rating",
                        value: `${result.thumbs_up} thumbs up. ${result.thumbs_down} thumbs down.`,
                    },
                )
                .withOkColor(message),
            );
        }

        return sendPaginatedMessage(message, pages, {});
    }
}
