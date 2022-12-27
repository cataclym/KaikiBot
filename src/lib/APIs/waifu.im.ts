import { hexColorTable } from "../Color";
import ImageAPI from "./Common/ImageAPI";
import { ImageAPIOptions } from "./Common/Types";

export default class WaifuIm extends ImageAPI<EndPointSignatures> {
    constructor(imageAPIData: ImageAPIOptions<EndPointSignatures>) {
        super(imageAPIData);
    }
}

type EndPointSignatures = "uniform"
    | "maid";

export const waifuImData: ImageAPIOptions<EndPointSignatures> = {
    endPointData: {
        "uniform": {
            action: "",
            color: hexColorTable["lightskyblue"],
        },
        "maid": {
            action: "",
            color: hexColorTable["lightskyblue"],
        },
    },
    objectIndex: ["images", "0", "url"],
    url: (string: string) => `https://api.waifu.im/search/?included_tags=${string}&is_nsfw=false`,
};
