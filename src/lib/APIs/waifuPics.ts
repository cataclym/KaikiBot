import { EmbedBuilder, GuildMember, Message } from "discord.js";
import { hexColorTable } from "../Color";
import InteractionsImageData from "../Interfaces/InteractionsImageData";
import { processAPIRequest } from "./APIProcessor";

type APIs = "bonk"
    | "cry"
    | "cuddle"
    | "hug"
    | "kiss"
    | "pat"
    | "waifu"
    | "yeet"
    | "bully"
    | "megumin"
    | "neko"
    | "shinobu"
    | "nom"
    | "slap";

const WaifuData: {
    [str in APIs]: InteractionsImageData
} = {
    "waifu": {
        action: false,
        color: hexColorTable["peachpuff"],
    },
    "neko": {
        action: false,
        color: hexColorTable["royalblue"],
    },
    "shinobu": {
        action: false,
        color: hexColorTable["lightyellow"],
    },
    "megumin": {
        action: false,
        color: hexColorTable["mediumvioletred"],
    },
    "cry": {
        action: false,
        color: hexColorTable["dodgerblue"],
        appendable: true,
    },
    "bully": {
        action: "bullied",
        color: hexColorTable["darkorchid"],
    },
    "cuddle": {
        action: "cuddled",
        color: hexColorTable["seagreen"],
    },
    "hug": {
        action: "hugged",
        color: hexColorTable["plum"],
    },
    "pat": {
        action: "patted",
        color: hexColorTable["mintcream"],
        append: "✨",
    },
    "bonk": {
        action: "bonked",
        color: hexColorTable["maroon"],
        append: "🏏",
    },
    "yeet": {
        action: "yeeted",
        color: hexColorTable["lawngreen"],
        append: "👋",
    },
    "kiss": {
        action: "kissed",
        color: hexColorTable["hotpink"],
        append: "♥️",
    },
    "nom": {
        action: "nommed",
        color: hexColorTable["mediumseagreen"],
    },
    "slap": {
        action: "slapped",
        color: hexColorTable["pink"],
        append: "👋",
    },
};

export default async function sendWaifuPics(message: Message, API: APIs, mention?: GuildMember | null): Promise<EmbedBuilder> {

    return processAPIRequest(message, `https://api.waifu.pics/sfw/${API}`, WaifuData[API], "url", mention);

}

