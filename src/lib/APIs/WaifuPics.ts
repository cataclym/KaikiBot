import { GuildMember, Message } from "discord.js";
import Constants from "../../struct/Constants";
import APIProcessor from "./APIProcessor";
import ImageAPI from "./Common/ImageAPI";
import type { ImageAPIOptions } from "./Common/Types";

export default class WaifuPics extends ImageAPI<APIs> {
    constructor(imageApiData: ImageAPIOptions<APIs> = WaifuPics.data) {
        super(imageApiData);
    }

    public async sendImageAPIRequest<T extends APIs>(
        message: Message,
        endPoint: T,
        mention?: GuildMember | null
    ) {
        return message.channel.send({
            embeds: [
                await APIProcessor.processImageAPIRequest(
                    message,
                    this.url(endPoint),
                    this.endPoints[endPoint],
                    this.objectIndex,
                    mention
                ),
            ],
        });
    }

    static data: ImageAPIOptions<APIs> = {
        endPointData: {
            waifu: {
                action: false,
                color: Constants.hexColorTable["peachpuff"],
            },
            neko: {
                action: false,
                color: Constants.hexColorTable["royalblue"],
            },
            shinobu: {
                action: false,
                color: Constants.hexColorTable["lightyellow"],
            },
            megumin: {
                action: false,
                color: Constants.hexColorTable["mediumvioletred"],
            },
            cry: {
                action: false,
                color: Constants.hexColorTable["dodgerblue"],
                appendable: true,
            },
            bully: {
                action: "bullied",
                color: Constants.hexColorTable["darkorchid"],
            },
            cuddle: {
                action: "cuddled",
                color: Constants.hexColorTable["seagreen"],
            },
            hug: {
                action: "hugged",
                color: Constants.hexColorTable["plum"],
            },
            pat: {
                action: "patted",
                color: Constants.hexColorTable["mintcream"],
                append: "✨",
            },
            bonk: {
                action: "bonked",
                color: Constants.hexColorTable["maroon"],
                append: "🏏",
            },
            yeet: {
                action: "yeeted",
                color: Constants.hexColorTable["lawngreen"],
                append: "👋",
            },
            kiss: {
                action: "kissed",
                color: Constants.hexColorTable["hotpink"],
                append: "♥️",
            },
            nom: {
                action: "nommed",
                color: Constants.hexColorTable["mediumseagreen"],
            },
            slap: {
                action: "slapped",
                color: Constants.hexColorTable["pink"],
                append: "👋",
            },
        },
        objectIndex: "url",
        url: (string: string) => `https://api.waifu.pics/sfw/${string}`,
    };
}

type APIs =
    | "bonk"
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
