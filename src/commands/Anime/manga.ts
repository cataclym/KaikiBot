import { EmbedBuilder, Message } from "discord.js";
import fetch from "node-fetch";

import { handleError, handleResponse, mangaQuery } from "../../lib/APIs/AnilistGraphQL";
import { IMangaRes } from "../../lib/Interfaces/IMangaRes";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

export default class MangaCommand extends KaikiCommand {
    constructor() {
        super("manga", {
            aliases: ["manga"],
            description: "Shows the first result of a query to Anilist",
            usage: "Tsukimonogatari",
            args: [
                {
                    id: "manga",
                    type: "string",
                    match: "content",
                    otherwise: (m) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
                },
            ],
        });
    }

    public async exec(message: Message<true>, { manga }: { manga: string }): Promise<Message | void> {

        const url = "https://graphql.anilist.co",
            options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    query: mangaQuery,
                    variables: {
                        search: manga,
                        page: 1,
                        perPage: 1,
                        type: "MANGA",
                    },
                }),
            };

        return await fetch(url, options).then(handleResponse)
            .then((response: IMangaRes) => {
                const {
                    coverImage,
                    title,
                    chapters,
                    description,
                    status,
                    startDate,
                    genres,
                    endDate,
                    siteUrl,
                } = response.data.Page.media[0];
                const monthFormat = new Intl.DateTimeFormat("en-US", { month: "long" });
                const started = startDate.month ? `${monthFormat.format(startDate.month)} ${startDate.day}, ${startDate.year}` : null;
                const ended = endDate.month ? `${monthFormat.format(endDate.month)} ${endDate.day}, ${endDate.year}` : null;
                const aired =
                    started && ended
                        ? started === ended
                            ? started
                            : `${started} to ${ended}`
                        : started || "N/A";

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setImage(coverImage.large)
                            .setTitle(title.english && title.romaji
                                ? `${title.english} / ${title.romaji}`
                                : title.english || title.romaji)
                            .setURL(siteUrl)
                            .setDescription(Utility.stripHtml(Utility.trim(description, Constants.MAGIC_NUMBERS.EMBED_LIMITS.DESCRIPTION)))
                            .withOkColor(message),
                        new EmbedBuilder()
                            .addFields([
                                { name: "Chapters", value: String(chapters ?? "N/A"), inline: true },
                                { name: "Release period", value: aired, inline: true },
                                { name: "Status", value: status, inline: true },
                                { name: "Genres", value: genres.join(", "), inline: false },
                            ])
                            .withOkColor(message),
                    ],
                });
            })
            .catch(handleError);
    }
}

