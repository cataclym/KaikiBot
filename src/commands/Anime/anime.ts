import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";

import CommonEmbed from "../../lib/Anime/CommonEmbed";
import AnilistGraphQL from "../../lib/APIs/AnilistGraphQL";
import AnimeData from "../../lib/Interfaces/Common/AnimeData";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "anime",
    aliases: [""],
    description: "Shows the first result of a query to Anilist",
    usage: "Tsukimonogatari",
    typing: true,
})
export default class AnimeCommand extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args) {
        const anime = await args.rest("string");

        const url = "https://graphql.anilist.co",
            options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    query: AnilistGraphQL.aniQuery,
                    variables: {
                        search: anime,
                        page: 1,
                        perPage: 1,
                        type: "ANIME",
                    },
                }),
            };

        return await fetch(url, options)
            .then(AnilistGraphQL.handleResponse)
            .then((response: AnimeData) => {
                const {
                    coverImage,
                    title,
                    episodes,
                    description,
                    format,
                    status,
                    studios,
                    startDate,
                    genres,
                    endDate,
                    siteUrl,
                } = response.data.Page.media[0];
                const monthFormat = new Intl.DateTimeFormat("en-US", {
                    month: "long",
                });
                const started = `${monthFormat.format(startDate.month)} ${startDate.day}, ${startDate.year}`;
                const ended = `${monthFormat.format(endDate.month)} ${endDate.day}, ${endDate.year}`;
                const aired =
                    started === ended ? started : `${started} to ${ended}`;

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
                                { name: "Format", value: format, inline: true },
                                {
                                    name: "Episodes",
                                    value: String(episodes),
                                    inline: true,
                                },
                                { name: "Aired", value: aired, inline: true },
                                { name: "Status", value: status, inline: true },
                                {
                                    name: "Genres",
                                    value: genres.join(", "),
                                    inline: true,
                                },
                                {
                                    name: "Studio(s)",
                                    value: studios.nodes
                                        .map((n) => n.name)
                                        .join(", "),
                                    inline: true,
                                },
                            ])
                            .withOkColor(message),
                    ],
                });
            })
            .catch(AnilistGraphQL.handleError);
    }
}
