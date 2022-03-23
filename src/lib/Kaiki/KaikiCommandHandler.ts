import { AkairoClient, ArgumentTypeCaster, CommandHandler, CommandHandlerOptions } from "discord-akairo";
import { Message } from "discord.js";
import { Color } from "sharp";
import { hexColorTable } from "../Color";
import Utility from "../Utility";

export default class KaikiCommandHandler extends CommandHandler {
    argumentTypes: { [p: string]: ArgumentTypeCaster };

    constructor(client: AkairoClient, options: CommandHandlerOptions) {
        super(client, options);

        this.argumentTypes = {
            kaiki_color: (message: Message, phrase: string): Color | null => {
                if (!phrase) return null;
                const hexColorString = phrase.replace("#", "");

                const color = parseInt(hexColorString, 16);
                if (color < 0 || color > 0xFFFFFF || isNaN(color) && !hexColorTable[hexColorString]) {
                    return null;
                }

                return Utility.HEXtoRGB(String(hexColorTable[hexColorString] ?? hexColorString));
            },
        };

        this.resolver.addTypes(this.argumentTypes);
    }
}
