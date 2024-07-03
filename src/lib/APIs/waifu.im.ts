import { GuildMember, Message } from "discord.js";
import Constants from "../../struct/Constants";
import APIProcessor from "./APIProcessor";
import ImageAPI from "./Common/ImageAPI";
import type { ImageAPIOptions } from "./Common/Types";

export default class WaifuIm extends ImageAPI<EndPointSignatures> {
    constructor(
        imageAPIData: ImageAPIOptions<EndPointSignatures> = WaifuIm.data
    ) {
        super(imageAPIData);
    }

    public async sendImageAPIRequest<T extends EndPointSignatures>(
        message: Message,
        endPoint: T,
        mention?: GuildMember | null,
        nsfw = false
    ) {
        return message.channel.send({
            embeds: [
                await APIProcessor.processImageAPIRequest(
                    message,
                    this.url(endPoint, nsfw),
                    this.endPoints[endPoint],
                    this.objectIndex,
                    mention
                ),
            ],
        });
    }

    static data: ImageAPIOptions<EndPointSignatures> = {
        endPointData: {
            uniform: {
                action: "",
                color: Constants.hexColorTable["lightskyblue"],
            },
            maid: {
                action: "",
                color: Constants.hexColorTable["lightskyblue"],
            },
            selfies: {
                action: "",
                color: Constants.hexColorTable["lightskyblue"],
            },
            "marin-kitagawa": {
                action: "",
                color: Constants.hexColorTable["lightskyblue"],
            },
            ero: {
                action: "",
                color: Constants.hexColorTable["hotpink"],
            },
        },
        objectIndex: ["images", "0", "url"],
        url: (string: string, nsfw = false) =>
            `https://api.waifu.im/search/?included_tags=${string}&is_nsfw=${nsfw}`,
    };
}

export enum EndPointSignatures {
    uniform = "uniform",
    maid = "maid",
    selfies = "selfies",
    marinKitagawa = "marin-kitagawa",
    ero = "ero"
}
