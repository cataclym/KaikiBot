import type { ImageAPIEndPointTypes, ImageAPIOptions } from "./Types";

export default class ImageAPI<FullEndpointType extends string> {
    readonly objectIndex: string | string[];
    readonly endPoints: ImageAPIEndPointTypes<FullEndpointType>;
    readonly token: string | undefined;
    readonly url: (endPoint: FullEndpointType) => string;

    constructor(imageAPIData: ImageAPIOptions<FullEndpointType>) {
        this.endPoints = imageAPIData.endPointData;
        this.token = imageAPIData.token;
        this.url = imageAPIData.url;
        this.objectIndex = imageAPIData.objectIndex;
    }
}
