import InteractionsImageData from "../../Interfaces/Common/InteractionsImageData";
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
    endPointData: ImageAPIEndPointTypes<T>;
    url: (endPoint: T) => string;
    objectIndex: string | string[];
    token?: string | undefined;
}

export type ClientImageAPIs = {
    KawaiiAPI: KawaiiAPI;
    NekosLife: NekosLife;
    NekosAPI: NekosAPI;
    PurrBot: PurrBot;
    WaifuIm: WaifuIm;
    WaifuPics: WaifuPics;
};

export type APIs = keyof ClientImageAPIs;

export enum NekosAPITags {
    Illustration = 1,
    Girl = 2,
    "Black hair" = 3,
    Sportswear = 4,
    Sword = 5,
    Kemonomimi = 6,
    Flowers = 7,
    Catgirl = 8,
    "White hair" = 9,
    Loli = 10,
    Plants = 11,
    "Blue Hair" = 12,
    "Pink hair" = 13,
    "Purple hair" = 14,
    "Exposed girl breasts" = 15,
    "Exposed anus" = 16,
    Pussy = 17,
    Dick = 18,
    Maid = 19,
    Beach = 20,
    Reading = 21,
    Mountain = 22,
    Night = 23,
    Gloves = 24,
    "Original Style" = 25,
    "Brown Hair" = 26,
    Sunny = 27,
    Rain = 28,
    Shorts = 29,
    Weapon = 30,
    Bikini = 31,
    "Ice Cream" = 32,
    Tree = 33,
    "Bunny girl" = 34,
    Dress = 35,
    Usagimimi = 36,
    "School Uniform" = 37,
    Guitar = 38,
    "Baggy Clothes" = 39,
    Wet = 40,
    Yuri = 41,
    "Red hair" = 42,
    Glasses = 43,
    Anal = 44,
    Futanari = 45,
    Masturbating = 46,
    Threesome = 47,
    Kissing = 48,
    Skirt = 49,
    "Blonde hair" = 50,
    Horsegirl = 51,
    Boy = 52,
}
