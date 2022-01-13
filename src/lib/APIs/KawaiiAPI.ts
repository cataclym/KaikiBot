import { GuildMember, Message, MessageEmbed } from "discord.js";
import { hexColorTable } from "../Color";
import { processAPIRequest } from "./APIProcessor";
import { endpointData } from "../../interfaces/IAPIData";

type endPointSignatures = "run"
    | "peek"
    | "pout"
	| "lick";

const token = process.env.KAWAIIKEY;

const endPoints: {
	[str in endPointSignatures]: endpointData
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

export default async function getKawaiiResponseEmbed(message: Message, endpoint: endPointSignatures, mention?: GuildMember | null): Promise<MessageEmbed | undefined> {

    if (!token) {
        return;
    }

    return processAPIRequest(message, `https://kawaii.red/api/gif/${endpoint}/token=${token}`, endPoints[endpoint], "response", mention);
}
