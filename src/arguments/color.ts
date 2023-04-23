import { Argument } from "@sapphire/framework";
import { hexColorTable } from "../lib/Color";
import KaikiUtil from "../lib/Kaiki/KaikiUtil";
import { KaikiColor } from "../lib/Types/KaikiColor";
import Utility from "../lib/Utility";

export class ColorArgument extends Argument<KaikiColor> {
    private message = "Please provide a valid hex-color or a color name!";

    private hexRegex = /^#?[0-9A-F]{6}$/i;

    public run(parameter: string, context: Argument.Context<KaikiColor>): Argument.AwaitableResult<KaikiColor> {

        // Uncommented for being unnecessary, but still cool to have.
        // const hexInteger = parseInt(parameter);
        //
        // if (!isNaN(hexInteger)) {
        //     return this.ok(Utility.HEXtoRGB(hexInteger.toString(16).toUpperCase()));
        // }

        if (this.hexRegex.test(parameter)) {
            return this.ok(Utility.HEXtoRGB(parameter));
        }

        if (KaikiUtil.hasKey(hexColorTable, parameter)) return this.ok(Utility.HEXtoRGB(hexColorTable[parameter]));

        return this.error({
            parameter,
            message: this.message,
            context,
        });
    }
}
