import { EmbedBuilder, GuildMember, Message } from "discord.js";
import { hexColorTable } from "../Color";
import InteractionsImageData from "../Interfaces/InteractionsImageData";
import APIProcessor from "./APIProcessor";

type APIs = "spank";

const nekosData: {
    [str in APIs]: InteractionsImageData
} = {
    "spank": {
        action: "spanked",
        color: hexColorTable["peachpuff"],
        append: "🍑👋",
    },
};

export default async function getNekosPics(message: Message, API: APIs, mention?: GuildMember | null): Promise<EmbedBuilder> {

    return APIProcessor.processAPIRequest(message, `https://nekos.life/api/v2/img/${API}`, nekosData[API], "url", mention);
}

