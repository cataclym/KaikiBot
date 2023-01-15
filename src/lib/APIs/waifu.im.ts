import { GuildMember, Message } from "discord.js";
import { hexColorTable } from "../Color";
import APIProcessor from "./APIProcessor";
import ImageAPI from "./Common/ImageAPI";
import type { ImageAPIOptions } from "./Common/Types";

export default class WaifuIm extends ImageAPI<EndPointSignatures> {
    constructor(imageAPIData: ImageAPIOptions<EndPointSignatures> = WaifuIm.data) {
        super(imageAPIData);
    }

    public async sendImageAPIRequest<T extends EndPointSignatures>(message: Message, endPoint: T, mention?: GuildMember | null, nsfw = false) {
        return message.channel.send({
            embeds: [
                await APIProcessor.processImageAPIRequest(message,
                    this.url(endPoint, nsfw),
                    this.endPoints[endPoint],
                    this.objectIndex,
                    mention),
            ],
        });
    }

    static data: ImageAPIOptions<EndPointSignatures> = {
        endPointData: {
            "uniform": {
                action: "",
                color: hexColorTable["lightskyblue"],
            },
            "maid": {
                action: "",
                color: hexColorTable["lightskyblue"],
            },
            "selfies": {
                action: "",
                color: hexColorTable["lightskyblue"],
            },
            "marin-kitagawa": {
                action: "",
                color: hexColorTable["lightskyblue"],
            },
            "ero": {
                action: "",
                color: hexColorTable["hotpink"],
            },
        },
        objectIndex: ["images", "0", "url"],
        url: (string: string, nsfw = false) => `https://api.waifu.im/search/?included_tags=${string}&is_nsfw=${nsfw}`,
    };

}

type EndPointSignatures = "uniform"
    | "maid"
    | "selfies"
    | "marin-kitagawa"
    | "ero";
