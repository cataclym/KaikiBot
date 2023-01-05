import { GuildMember, Message } from "discord.js";
import { hexColorTable } from "../Color";
import APIProcessor from "./APIProcessor";
import ImageAPI from "./Common/ImageAPI";
import { ImageAPIOptions } from "./Common/Types";

type EndPoints = "catgirl";

export default class NekosAPI extends ImageAPI<EndPoints> {
    constructor(data: ImageAPIOptions<EndPoints> = NekosAPI.data) {
        super(data);
    }

    public async sendImageAPIRequest<T extends EndPoints>(message: Message, endPoint: T, mention?: GuildMember | null) {

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

    static data: ImageAPIOptions<EndPoints> = {
        endPointData: {
            "catgirl": {
                color: hexColorTable["lightgoldenrodyellow"],
                action: false,
            },
        },
        objectIndex: ["data", "0", "url"],
        url: endPoint => `https://nekos.nekidev.com/api/image?categories=${endPoint}&?nsfw=sfw`,
    };
}
