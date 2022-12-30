import { GuildMember, Message } from "discord.js";
import { hexColorTable } from "../Color";
import APIProcessor from "./APIProcessor";
import ImageAPI from "./Common/ImageAPI";
import { ImageAPIOptions } from "./Common/Types";

type APIs = "spank";

export default class NekosLife extends ImageAPI<APIs> {
    constructor(data: ImageAPIOptions<"spank"> = NekosLife.data) {
        super(data);
    }

    public async sendImageAPIRequest<T extends APIs>(message: Message, endPoint: T, mention?: GuildMember | null) {

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

    static data: ImageAPIOptions<APIs> = {
        endPointData: {
            "spank": {
                action: "spanked",
                color: hexColorTable["peachpuff"],
                append: "🍑👋",
            },
        },
        url: (endPoint: APIs) => `https://nekos.life/api/v2/img/${endPoint}`,
        objectIndex: "url",
    };
}
