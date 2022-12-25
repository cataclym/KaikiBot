import { Message } from "discord.js";
import InteractionsImageData from "src/lib/Interfaces/InteractionsImageData";
import APIProcessor from "../APIProcessor";

export type GenericAliasString<T> = T;
export type GenericEndPointType = { [index in GenericAliasString<string>]: InteractionsImageData };

export default class ImageAPI<FullEndpointType extends GenericEndPointType> {
    private readonly objectIndex: string | string[];
    private readonly endPoints: FullEndpointType;
    private readonly token: string | undefined;
    private readonly url: (endPoint: string) => string;

    constructor(imageAPIData: {
        endPointData: FullEndpointType, url: (endPoint: string) => string, objectIndex: string | string[], token?: string | undefined;
    }) {
        this.endPoints = imageAPIData.endPointData;
        this.token = imageAPIData.token;
        this.url = imageAPIData.url;
        this.objectIndex = imageAPIData.objectIndex;
    }

    public async sendImageAPIRequest(message: Message, endPoint: keyof FullEndpointType) {
        return message.channel.send({
            embeds: [await APIProcessor.processImageAPIRequest(message, this.url(endPoint as string), this.endPoints[endPoint], this.objectIndex)],
        });
    }
}
