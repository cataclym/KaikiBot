import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Maid extends KaikiCommand {
    constructor() {
        super("maid", {
            aliases: ["maid"],
            description: "Returns anime maids.",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message) {
        return this.client.imageAPIs.WaifuIm.sendImageAPIRequest(message, "maid");
    }
}
