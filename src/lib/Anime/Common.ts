import { EmbedBuilder, Guild, Message } from "discord.js";
import Constants from "../../struct/Constants";
import { CoverImage, EndDateClass as AnimeDateClass, Title } from "../Interfaces/Common/AnimeData";
import { EndDateClass as MangaDateClass } from "../Interfaces/Common/MangaData";
import KaikiUtil from "../KaikiUtil";

export default class Common {
    static monthFormat = new Intl.DateTimeFormat("en-US", {
        month: "long",
    });

    static formatDate(data: AnimeDateClass | MangaDateClass) {
        return Object.values(data).some(Boolean) ? `${data.day} ${Common.monthFormat.format(data.month || 0)}, ${data.year}` : "N/A";
    }

    static createEmbed = (
        coverImage: CoverImage,
        title: Title,
        siteUrl: string | null,
        description: string,
        message: Message<boolean> | Guild
    ) =>
        new EmbedBuilder()
            .setImage(coverImage.large)
            .setTitle(
                title.english && title.romaji
                    ? title.english.toLowerCase() === title.romaji.toLowerCase()
                        ? title.english
                        : `${title.english} / ${title.romaji}`
                    : title.english || title.romaji
            )
            .setURL(siteUrl)
            .setDescription(
                KaikiUtil.stripHtml(
                    KaikiUtil.trim(
                        description,
                        Constants.MAGIC_NUMBERS.EMBED_LIMITS.DESCRIPTION
                    )
                )
            )
            .withOkColor(message);
}
