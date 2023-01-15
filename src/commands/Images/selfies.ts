import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Selfies extends KaikiCommand {
    constructor() {
        super("selfies", {
            aliases: ["selfies"],
            description: "Returns anime girl selfies",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message> {
        return this.client.imageAPIs.WaifuIm.sendImageAPIRequest(message, "selfies");
    }
}
