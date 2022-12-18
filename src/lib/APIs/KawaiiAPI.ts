import { EmbedBuilder, GuildMember, Message } from "discord.js";
import { hexColorTable } from "../Color";
import { EndpointData } from "../Interfaces/IAPIData";
import { processAPIRequest } from "./APIProcessor";

type EndpointSignatures = "run"
    | "peek"
    | "pout"
    | "lick";

const token = process.env.KAWAIIKEY;

const endPoints: {
    [str in EndpointSignatures]: EndpointData
} = {
    "run": {
        action: "is running away!!",
        color: hexColorTable["chartreuse"],
        appendable: true,
    },
    "peek": {
        action: "peeks",
        color: hexColorTable["papayawhip"],
        append: "👀",
        appendable: true,
    },
    "pout": {
        action: "pouts",
        color: hexColorTable["darkseagreen"],
        append: "😒",
        appendable: true,
    },
    "lick": {
        action: "licked",
        color: hexColorTable["mediumpurple"],
        append: "😛",
        appendable: true,
    },
};

export default async function getKawaiiResponseEmbed(message: Message, endpoint: EndpointSignatures, mention?: GuildMember | null): Promise<EmbedBuilder | undefined> {

    if (!token) {
        return;
    }

    return processAPIRequest(message, `https://kawaii.red/api/gif/${endpoint}/token=${token}`, endPoints[endpoint], "response", mention);
}
