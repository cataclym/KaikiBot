import InteractionsImageData from "../../Interfaces/InteractionsImageData";
import KawaiiAPI from "../KawaiiAPI";
import NekosLife from "../nekos.life";
import NekosAPI from "../NekosAPI";
import PurrBot from "../PurrBot";
import WaifuIm from "../waifu.im";
import WaifuPics from "../WaifuPics";

export type ImageAPIEndPointTypes<T extends string> = {
    [index in T]: InteractionsImageData;
};

export interface ImageAPIOptions<T extends string> {
    endPointData: ImageAPIEndPointTypes<T>,
    url: (endPoint: T) => string,
    objectIndex: string | string[],
    token?: string | undefined;
}

export type ClientImageAPIs = {
    "KawaiiAPI": KawaiiAPI,
    "NekosLife": NekosLife,
    "NekosAPI": NekosAPI;
    "PurrBot": PurrBot;
    "WaifuIm": WaifuIm,
    "WaifuPics": WaifuPics
}

export type APIs = keyof ClientImageAPIs
