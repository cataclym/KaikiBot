import InteractionsImageData from "../../Interfaces/InteractionsImageData";

export type ImageAPIEndPointTypes<T extends string> = {
    [index in T]: InteractionsImageData;
};

export interface ImageAPIOptions<T extends string> {
    endPointData: ImageAPIEndPointTypes<T>,
    url: (endPoint: T) => string,
    objectIndex: string | string[],
    token?: string | undefined;
}

export type APIs = "WaifuIm"
    | "WaifuPics";
