import { GuildMember, Message } from "discord.js";
import Constants from "../../struct/Constants";
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
                color: Constants.hexColorTable["lightgoldenrodyellow"],
                action: false,
            },
        },
        objectIndex: ["data", "0", "url"],
        url: endPoint => `https://v1.nekosapi.com/api/image/random?categories=${endPoint}&?nsfw=sfw`,
    };
}
