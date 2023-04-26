import Constants from "../../struct/Constants";

export default class KaikiUtil {
    public static async handleToJSON(data: any) {
        if (data) return data;
        throw new Error("No data was found");
    }

    public static errorColor = Constants.hexColorTable["red"];
    public static okColor = "#00ff00";

    public static hasKey<O extends object>(obj: O, key: PropertyKey): key is keyof O {
        return key in obj;
    }
}
