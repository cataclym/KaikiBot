import { GuildMember, Message } from "discord.js";
import { hexColorTable } from "../Color";
import APIProcessor from "./APIProcessor";
import ImageAPI from "./Common/ImageAPI";
import { ImageAPIOptions } from "./Common/Types";

type EndPointSignatures = "run"
    | "peek"
    | "pout"
    | "lick";

export default class KawaiiAPI extends ImageAPI<EndPointSignatures> {
    constructor(data: ImageAPIOptions<EndPointSignatures> = KawaiiAPI.data) {
        super(data);
    }

    private static token = process.env.KAWAIIKEY;

    public async sendImageAPIRequest<T extends EndPointSignatures>(message: Message, endPoint: T, mention?: GuildMember | null) {

        if (!KawaiiAPI.token) {
            return;
        }

        return message.channel.send({
            embeds: [
                await APIProcessor.processImageAPIRequest(message,
                    this.url(endPoint),
                    this.endPoints[endPoint],
                    this.objectIndex,
                    mention),
            ],
        });
    }

    static data: ImageAPIOptions<EndPointSignatures> = {
        endPointData: {
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
        },
        url: (endPoint: EndPointSignatures) => `https://kawaii.red/api/gif/${endPoint}/token=${KawaiiAPI.token}`,
        objectIndex: "response",
    };

}
