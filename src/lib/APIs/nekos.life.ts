import { GuildMember, Message, MessageEmbed } from "discord.js";
import { hexColorTable } from "../Color";
import { processAPIRequest } from "./APIProcessor";
import { endpointData } from "../Interfaces/IAPIData";

type APIs = "spank";

const nekosData: {
        [str in APIs]: endpointData
	} = {
	    "spank": {
	        action: "spanked",
	        color: hexColorTable["peachpuff"],
	        append: "🍑👋",
	    },
	};

export default async function sendNekosPics(message: Message, API: APIs, mention?: GuildMember | null): Promise<MessageEmbed> {

    return processAPIRequest(message, `https://nekos.life/api/v2/img/${API}`, nekosData[API], "url", mention);
}

