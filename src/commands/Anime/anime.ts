import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { KaikiCommand } from "kaiki";
import { aniQuery, handleError, handleResponse } from "../../lib/APIs/AnilistGraphQL";
import { IAnimeRes } from "../../interfaces/IAnimeRes";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";

export default class AnimeCommand extends KaikiCommand {
    constructor() {
        super("anime", {
            aliases: ["anime"],
            description: "Shows the first result of a query to Anilist",
            usage: "Tsukimonogatari",
            args: [{
                id: "anime",
                type: "string",
                match: "content",
                otherwise: (m) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
            }],
        });
    }

    public async exec(message: Message, { anime }: { anime: string}): Promise<Message | void> {

        const url = "https://graphql.anilist.co",
            options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    query: aniQuery,
                    variables: {
                        search: anime,
                        page: 1,
                        perPage: 1,
                        type: "ANIME",
                    },
                }),
            };

        return await fetch(url, options).then(handleResponse)
            .then((response: IAnimeRes) => {

                const { coverImage, title, episodes, description, format, status, studios, startDate, genres, endDate, siteUrl } = response.data.Page.media[0];
                const monthFormat = new Intl.DateTimeFormat("en-US", { month: "long" });
                const started = `${monthFormat.format(startDate.month)} ${startDate.day}, ${startDate.year}`;
                const ended = `${monthFormat.format(endDate.month)} ${endDate.day}, ${endDate.year}`;
                const aired = started === ended
                    ? started
                    : `${started} to ${ended}`;

                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setImage(coverImage.large)
                            .setTitle(title.english && title.romaji
                                ? `${title.english} / ${title.romaji}`
                                : title.english || title.romaji)
                            .setURL(siteUrl)
                            .setDescription(Utility.stripHtml(Utility.trim(description, 2000)))
                            .withOkColor(message),
                        new MessageEmbed()
                            .addFields([
                                { name: "Format", value: format, inline: true },
                                { name: "Episodes", value: String(episodes), inline: true },
                                { name: "Aired", value: aired, inline: true },
                                { name: "Status", value: status, inline: true },
                                { name: "Genres", value: genres.join(", "), inline: true },
                                { name: "Studio(s)", value: studios.nodes.map(n => n.name).join(", "), inline: true },
                            ])
                            .withOkColor(message),
                    ],
                });
            })
            .catch(handleError);
    }
}

