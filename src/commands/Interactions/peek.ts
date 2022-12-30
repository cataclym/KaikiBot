import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Peek extends KaikiCommand {
    constructor() {
        super("peek", {
            aliases: ["peek"],
            description: "Peek around the corner",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message | void> {

        return this.client.imageAPIs.KawaiiAPI.sendImageAPIRequest(message, "peek");
    }
}
