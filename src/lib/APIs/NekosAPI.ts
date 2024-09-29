import { GuildMember, Message } from "discord.js";
import Constants from "../../struct/Constants";
import APIProcessor from "./APIProcessor";
import ImageAPI from "./Common/ImageAPI";
import { ImageAPIOptions, NekosAPITags } from "./Common/Types";

type EndPoints = keyof typeof NekosAPITags;

const notImplementedEndPointData = {
    action: "",
    color: 0,
};

export default class NekosAPI extends ImageAPI<EndPoints> {
    constructor(data: ImageAPIOptions<EndPoints> = NekosAPI.data) {
        super(data);
    }

    public async sendImageAPIRequest<T extends EndPoints>(
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

    static data: ImageAPIOptions<EndPoints> = {
        endPointData: {
            Anal: notImplementedEndPointData,
            "Baggy Clothes": notImplementedEndPointData,
            Beach: notImplementedEndPointData,
            Bikini: notImplementedEndPointData,
            "Black hair": notImplementedEndPointData,
            "Blonde hair": notImplementedEndPointData,
            "Blue Hair": notImplementedEndPointData,
            Boy: notImplementedEndPointData,
            "Brown Hair": notImplementedEndPointData,
            "Bunny girl": notImplementedEndPointData,
            Catgirl: {
                action: false,
                color: Constants.hexColorTable["lightgoldenrodyellow"],
            },
            Dick: notImplementedEndPointData,
            Dress: notImplementedEndPointData,
            "Exposed anus": notImplementedEndPointData,
            "Exposed girl breasts": notImplementedEndPointData,
            Flowers: notImplementedEndPointData,
            Futanari: notImplementedEndPointData,
            Girl: {
                action: false,
                color: Constants.hexColorTable["gold"],
            },
            Glasses: notImplementedEndPointData,
            Gloves: notImplementedEndPointData,
            Guitar: notImplementedEndPointData,
            Horsegirl: notImplementedEndPointData,
            "Ice Cream": notImplementedEndPointData,
            Illustration: notImplementedEndPointData,
            Kemonomimi: notImplementedEndPointData,
            Kissing: notImplementedEndPointData,
            Loli: notImplementedEndPointData,
            Maid: notImplementedEndPointData,
            Masturbating: notImplementedEndPointData,
            Mountain: notImplementedEndPointData,
            Night: notImplementedEndPointData,
            "Original Style": notImplementedEndPointData,
            "Pink hair": notImplementedEndPointData,
            Plants: notImplementedEndPointData,
            "Purple hair": notImplementedEndPointData,
            Pussy: notImplementedEndPointData,
            Rain: notImplementedEndPointData,
            Reading: notImplementedEndPointData,
            "Red hair": notImplementedEndPointData,
            "School Uniform": notImplementedEndPointData,
            Shorts: notImplementedEndPointData,
            Skirt: notImplementedEndPointData,
            Sportswear: notImplementedEndPointData,
            Sunny: notImplementedEndPointData,
            Sword: notImplementedEndPointData,
            Threesome: notImplementedEndPointData,
            Tree: notImplementedEndPointData,
            Usagimimi: notImplementedEndPointData,
            Weapon: notImplementedEndPointData,
            Wet: notImplementedEndPointData,
            "White hair": notImplementedEndPointData,
            Yuri: notImplementedEndPointData,
        },
        objectIndex: ["items", "0", "image_url"],
        url: (endPoint) =>
            `https://api.nekosapi.com/v3/images/random?tag=${NekosAPITags[endPoint]}&rating=safe&limit=1`,
    };
}
