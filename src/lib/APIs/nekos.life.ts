import { GuildMember, Message } from "discord.js";
import Constants from "../../struct/Constants";
import APIProcessor from "./APIProcessor";
import ImageAPI from "./Common/ImageAPI";
import { ImageAPIOptions } from "./Common/Types";

export enum APIs { spank = "spank" }

export default class NekosLife extends ImageAPI<APIs> {
    constructor(data: ImageAPIOptions<"spank"> = NekosLife.data) {
        super(data);
    }

    public async sendImageAPIRequest<T extends APIs>(
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

    static data: ImageAPIOptions<APIs> = {
        endPointData: {
            spank: {
                action: "spanked",
                color: Constants.hexColorTable["peachpuff"],
                append: "🍑👋",
            },
        },
        url: (endPoint: APIs) => `https://nekos.life/api/v2/img/${endPoint}`,
        objectIndex: "url",
    };
}
