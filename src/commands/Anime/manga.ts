import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { KaikiCommand } from "kaiki";
import { handleError, handleResponse, mangaQuery } from "../../lib/APIs/AnilistGraphQL";
import { stripHtml, trim } from "../../lib/Util";
import { noArgGeneric } from "../../lib/Embeds";
import { IMangaRes } from "../../interfaces/IMangaRes";

export default class MangaCommand extends KaikiCommand {
	constructor() {
		super("manga", {
			aliases: ["manga"],
			description: "Shows the first result of a query to Anilist",
			usage: "Tsukimonogatari",
			args: [{
				id: "manga",
				type: "string",
				match: "content",
				otherwise: (m) => noArgGeneric(m),
			}],
		});
	}

	public async exec(message: Message, { manga }: { manga: string}): Promise<Message | void> {

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

				const { coverImage, title, chapters, description, format, status, startDate, genres, endDate, siteUrl } = response.data.Page.media[0];
				const monthFormat = new Intl.DateTimeFormat("en-US", { month: "long" });
				const started = startDate.month ? `${monthFormat.format(startDate.month)} ${startDate.day}, ${startDate.year}` : null;
				const ended = endDate.month ? `${monthFormat.format(endDate.month)} ${endDate.day}, ${endDate.year}` : null;
				const aired = started === ended && started !== null && ended !== null
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
							.setDescription(stripHtml(trim(description, 2000)))
							.withOkColor(message),
						new MessageEmbed()
							.addFields([
								{ name: "Format", value: format, inline: true },
								{ name: "Episodes", value: String(chapters ?? "N/A"), inline: true },
								{ name: "Aired", value: aired, inline: true },
								{ name: "Status", value: status, inline: true },
								{ name: "Genres", value: genres.join(", "), inline: true },
							])
							.withOkColor(message),
					],
				});
			})
			.catch(handleError);
	}
}

