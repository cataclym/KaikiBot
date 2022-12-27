import { hexColorTable } from "../Color";
import ImageAPI from "./Common/ImageAPI";
import type { ImageAPIOptions } from "./Common/Types";

export default class WaifuPics extends ImageAPI<APIs> {
    constructor(imageApiData: ImageAPIOptions<APIs>) {
        super(imageApiData);
    }
}

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

export const waifuPicsData: ImageAPIOptions<APIs> = {
    endPointData: {
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
    },
    objectIndex: "url",
    url: (string: string) => `https://api.waifu.pics/sfw/${string}`,
};
