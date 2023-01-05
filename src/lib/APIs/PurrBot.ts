import { GuildMember, Message } from "discord.js";
import { hexColorTable } from "../Color";
import APIProcessor from "./APIProcessor";
import ImageAPI from "./Common/ImageAPI";
import { ImageAPIOptions } from "./Common/Types";

type EndpointSignatures = "bite"
    | "blush"
    | "feed";

export default class PurrBot extends ImageAPI<EndpointSignatures> {
    constructor(data: ImageAPIOptions<EndpointSignatures> = PurrBot.data) {
        super(data);
    }

    public async sendImageAPIRequest<T extends EndpointSignatures>(message: Message, endPoint: T, mention?: GuildMember | null) {

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

    static data: ImageAPIOptions<EndpointSignatures> = {
        endPointData: {
            "bite": {
                action: "just bit",
                color: hexColorTable["crimson"],
                append: "!!!",
            },
            "blush": {
                action: "blushed",
                color: hexColorTable["mediumorchid"],
                appendable: true,

            },
            "feed": {
                action: "fed",
                color: hexColorTable["springgreen"],
                append: "🍖",
            },
        },
        url: endPoint => `https://purrbot.site/api/img/sfw/${endPoint}/gif`,
        objectIndex: "link",
    };
}
