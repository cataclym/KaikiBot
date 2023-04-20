import { Argument } from "@sapphire/framework";
import { hexColorTable } from "../lib/Color";
import KaikiUtil from "../lib/Kaiki/KaikiUtil";
import { KaikiColor } from "../lib/Types/KaikiColor";
import Utility from "../lib/Utility";
import Constants from "../struct/Constants";

export class ColorArgument extends Argument<KaikiColor> {
    public run(parameter: string, context: Argument.Context<KaikiColor>): Argument.AwaitableResult<KaikiColor> {

        if (!parameter) {
            return this.error({
                parameter,
            });
        }

        const hexInteger = parseInt(parameter);

        if (!isNaN(hexInteger)) {
            return this.ok(Utility.HEXtoRGB(hexInteger.toString(16)));
        }

        const hexColorString = parameter.replace("#", "");

        const color = parseInt(hexColorString, 16);

        if (color < 0
            || color > Constants.MAGIC_NUMBERS.LIB.KAIKI.KAIKI_ARGS.MAX_COLOR_VALUE
            || isNaN(color)
            && !KaikiUtil.hasKey(hexColorTable, hexColorString)) {
            return this.error({
                parameter,
            });
        }

        return this.ok(Utility.HEXtoRGB(String(KaikiUtil.hasKey(hexColorTable, hexColorString)
            ? hexColorTable[hexColorString]
            : hexColorString)));
    }
}
