import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Pout extends KaikiCommand {
    constructor() {
        super("pout", {
            aliases: ["pout"],
            description: "I am not angry, b-baka",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message | void> {

        return this.client.imageAPIs.KawaiiAPI.sendImageAPIRequest(message, "pout");
    }
}
