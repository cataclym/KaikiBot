import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";

import CommonEmbed from "../../lib/Anime/CommonEmbed";

import AnilistGraphQL from "../../lib/APIs/AnilistGraphQL";
import MangaData from "../../lib/Interfaces/Common/MangaData";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "manga",
    aliases: [""],
    description: "Shows the first result of a query to Anilist",
    usage: "Tsukimonogatari",
    typing: true,
})
export default class MangaCommand extends KaikiCommand {
    public async messageRun(
        message: Message<true>,
        args: Args
    ): Promise<Message | void> {
        const manga = await args.rest("string");

        const url = "https://graphql.anilist.co",
            options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    query: AnilistGraphQL.mangaQuery,
                    variables: {
                        search: manga,
                        page: 1,
                        perPage: 1,
                        type: "MANGA",
                    },
                }),
            };

        return await fetch(url, options)
            .then(AnilistGraphQL.handleResponse)
            .then((response: MangaData) => {
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
                const monthFormat = new Intl.DateTimeFormat("en-US", {
                    month: "long",
                });
                const started = startDate.month
                    ? `${monthFormat.format(startDate.month)} ${startDate.day}, ${startDate.year}`
                    : null;
                const ended = endDate.month
                    ? `${monthFormat.format(endDate.month)} ${endDate.day}, ${endDate.year}`
                    : null;
                const aired =
					started && ended
					    ? started === ended
					        ? started
					        : `${started} to ${ended}`
					    : started || "N/A";

                return message.channel.send({
                    embeds: [
                        CommonEmbed.createEmbed(
                            coverImage,
                            title,
                            siteUrl,
                            description,
                            message
                        ),
                        new EmbedBuilder()
                            .addFields([
                                {
                                    name: "Chapters",
                                    value: String(chapters ?? "N/A"),
                                    inline: true,
                                },
                                {
                                    name: "Release period",
                                    value: aired,
                                    inline: true,
                                },
                                { name: "Status", value: status, inline: true },
                                {
                                    name: "Genres",
                                    value: genres.join(", "),
                                    inline: false,
                                },
                            ])
                            .withOkColor(message),
                    ],
                });
            })
            .catch(AnilistGraphQL.handleError);
    }
}
