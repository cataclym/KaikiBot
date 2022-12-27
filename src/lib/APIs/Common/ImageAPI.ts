import { GuildMember, Message } from "discord.js";
import APIProcessor from "../APIProcessor";
import { ImageAPIEndPointTypes, ImageAPIOptions } from "./Types";

export default class ImageAPI<FullEndpointType extends string> {
    readonly objectIndex: string | string[];
    readonly endPoints: ImageAPIEndPointTypes<FullEndpointType>;
    readonly token: string | undefined;
    readonly url: (endPoint: FullEndpointType) => string;

    constructor(imageAPIData: ImageAPIOptions<FullEndpointType>) {
        this.endPoints = imageAPIData.endPointData;
        this.token = imageAPIData.token;
        this.url = imageAPIData.url;
        this.objectIndex = imageAPIData.objectIndex;
    }

    public async sendImageAPIRequest(message: Message, endPoint: FullEndpointType, mention?: GuildMember | null) {
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
}
