import { Argument } from "@sapphire/framework";
import KaikiUtil from "../lib/KaikiUtil";
import { KaikiColor } from "../lib/Types/KaikiColor";
import Constants from "../struct/Constants";

export class KaikiColorArgument extends Argument<KaikiColor> {
    private message = "Please provide a valid hex-color or a color name!";

    private hexRegex = /^#?[0-9A-F]{6}$/i;

    public run(
        parameter: string,
        context: Argument.Context<KaikiColor>
    ): Argument.AwaitableResult<KaikiColor> {
        // Uncommented for being unnecessary, but still cool to have.
        // const hexInteger = parseInt(parameter);
        //
        // if (!isNaN(hexInteger)) {
        //     return this.ok(Utility.HEXtoRGB(hexInteger.toString(16).toUpperCase()));
        // }

        if (this.hexRegex.test(parameter)) {
            return this.ok(KaikiUtil.convertHexToRGB(parameter));
        }

        if (KaikiUtil.hasKey(Constants.hexColorTable, parameter))
            return this.ok(
                KaikiUtil.convertHexToRGB(Constants.hexColorTable[parameter])
            );

        return this.error({
            parameter,
            message: this.message,
            context,
        });
    }
}
