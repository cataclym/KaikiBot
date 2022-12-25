import InteractionsImageData from "../Interfaces/InteractionsImageData";
import ImageAPI from "./Common/ImageAPI";


type EndPointSignatures = "uniform"
    | "maid";
type WaifuImEndpoint = { [index in EndPointSignatures]: InteractionsImageData }

export default class WaifuIm extends ImageAPI<WaifuImEndpoint> {
    constructor(imageAPIData: { endPointData: WaifuImEndpoint, url: (endPoint: string) => string, objectIndex: string | string[], token?: string | undefined }) {
        super(imageAPIData);
    }
}
