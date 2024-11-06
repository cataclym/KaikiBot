import { GuildMember, Message } from "discord.js";
import Constants from "../../struct/Constants";
import APIProcessor from "./APIProcessor";
import ImageAPI from "./Common/ImageAPI";
import { ImageAPIOptions } from "./Common/Types";

export enum EndpointSignatures { bite = "bite", blush = "blush", feed = "feed" }

export default class PurrBot extends ImageAPI<EndpointSignatures> {
    constructor(data: ImageAPIOptions<EndpointSignatures> = PurrBot.data) {
        super(data);
    }

    public async sendImageAPIRequest<T extends EndpointSignatures>(
        message: Message,
        endPoint: T,
        mention?: GuildMember | null
    ) {
        return message.reply({
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

    static data: ImageAPIOptions<EndpointSignatures> = {
        endPointData: {
            bite: {
                action: "just bit",
                color: Constants.hexColorTable["crimson"],
                append: "!!!",
            },
            blush: {
                action: "blushed",
                color: Constants.hexColorTable["mediumorchid"],
                appendable: true,
            },
            feed: {
                action: "fed",
                color: Constants.hexColorTable["springgreen"],
                append: "🍖",
            },
        },
        url: (endPoint) => `https://purrbot.site/api/img/sfw/${endPoint}/gif`,
        objectIndex: "link",
    };
}
