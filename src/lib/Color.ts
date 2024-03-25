import sharp from "sharp";
import Constants from "../struct/Constants";
import { KaikiColor } from "./Types/KaikiColor";

export async function imgFromColor(
    color: KaikiColor,
    size = Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_WIDTH_HEIGHT
): Promise<Buffer> {
    return Promise.resolve(
        sharp({
            create: {
                width: size,
                height: size,
                channels: 3,
                background: color,
            },
        })
            .jpeg()
            .toBuffer()
    );
}
