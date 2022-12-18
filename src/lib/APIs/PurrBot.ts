import { EmbedBuilder, GuildMember, Message } from "discord.js";
import { hexColorTable } from "../Color";
import { EndpointData } from "../Interfaces/IAPIData";
import { processAPIRequest } from "./APIProcessor";

type EndpointSignatures = "bite"
    | "blush"
    | "feed";

const endPoints: {
    [str in EndpointSignatures]: EndpointData
} = {
    "bite": {
        action: "just bit",
        color: hexColorTable["crimson"],
        append: "!!!",
    },
    "blush": {
        action: "blushed",
        color: hexColorTable["mediumorchid"],
        appendable: true,

    },
    "feed": {
        action: "fed",
        color: hexColorTable["springgreen"],
        append: "🍖",
    },
};

export default async function getPurrBotResponseEmbed(message: Message, endpoint: EndpointSignatures, mention?: GuildMember | null): Promise<EmbedBuilder> {
    return processAPIRequest(message, `https://purrbot.site/api/img/sfw/${endpoint}/gif`, endPoints[endpoint], "link", mention);
}

