import { GuildMember, Message, MessageEmbed } from "discord.js";
import { hexColorTable } from "../Color";
import { processAPIRequest } from "./APIProcessor";
import { endpointData } from "../../interfaces/IAPIData";

type endPointSignatures = "bite"
	| "blush"
	| "feed";

const endPoints: {
	[str in endPointSignatures]: endpointData
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

export default async function getPurrBotResponseEmbed(message: Message, endpoint: endPointSignatures, mention?: GuildMember | null): Promise<MessageEmbed> {
    return processAPIRequest(message, `https://purrbot.site/api/img/sfw/${endpoint}/gif`, endPoints[endpoint], "link", mention);
}

