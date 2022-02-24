import { hexColorTable } from "../Color";

export default class KaikiUtil {
    static async handleToJSON(data: any) {
        if (data) return data;
        throw new Error("No data was found");
    }

    static errorColor = hexColorTable["red"];
    static okColor = "#00ff00";
}
