import { EmbedBuilder, Guild, Message } from "discord.js";
import Constants from "../../struct/Constants";
import { CoverImage, Title } from "../Interfaces/Common/AnimeData";
import Utility from "../Utility";

export default class CommonEmbed {
    static createEmbed = (coverImage: CoverImage, title: Title, siteUrl: string | null, description: string, message: Message<boolean> | Guild) => new EmbedBuilder()
        .setImage(coverImage.large)
        .setTitle(title.english && title.romaji
            ? title.english === title.romaji
                ? title.english
                : `${title.english} / ${title.romaji}`
            : title.english || title.romaji)
        .setURL(siteUrl)
        .setDescription(Utility.stripHtml(Utility.trim(description, Constants.MAGIC_NUMBERS.EMBED_LIMITS.DESCRIPTION)))
        .withOkColor(message);
}
