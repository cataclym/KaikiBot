import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Uniform extends KaikiCommand {
    constructor() {
        super("uniform", {
            aliases: ["uniform"],
            description: "Returns anime girls in uniforms.",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message) {
        return this.client.imageAPIs.WaifuIm.sendImageAPIRequest(message, "uniform");
    }
}
